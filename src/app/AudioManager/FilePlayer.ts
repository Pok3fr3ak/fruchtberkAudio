import { Layer } from "../../electron/DB"
import { FadeDirection } from "../customInterfaces"
import fs from 'fs'

class FilePlayer {
    layer: Layer
    filePath: string
    context: AudioContext
    buffer: AudioBufferSourceNode
    gainNode: GainNode
    playing: boolean
    id: number

    constructor(layer: Layer, id: number) {
        this.id = id;
        this.layer = layer;
        this.filePath = layer.filePath;
        this.context = new AudioContext();
        this.playing = false;
    }

    init(buffer: AudioBuffer) {
        this.buffer = this.context.createBufferSource()
        this.gainNode = this.context.createGain();
        this.buffer.buffer = buffer
        this.buffer.connect(this.gainNode)
        this.gainNode.connect(this.context.destination)
        if (this.layer.fadeIN_Active === true) {
            this.gainNode.gain.setValueAtTime(0.0001, 0)
        } else {
            this.gainNode.gain.value = (this.layer.volume / 100)
        }

    }

    play(stop?: boolean) {
        console.log('Playing..');

        return new Promise<void>((resolve, reject) => {
            fs.readFile(this.filePath, (err, data) => {
                if (err) {
                    reject(err);
                    return
                }

                this.context.decodeAudioData(this.toArrayBuffer(data), (buffer) => {
                    this.init(buffer)
                    this.buffer.start(this.context.currentTime + (this.layer.start / 1000));
                    this.playing = true;
                    this.buffer.onended = this.onEnded.bind(this)

                    if (this.layer.fadeIN_Active === true) {
                        setTimeout(() => {
                            this.gainNode.gain.exponentialRampToValueAtTime((this.layer.volume / 100), (this.layer.fadeIN / 1000))
                            resolve();

                            if (stop === true) {
                                window.setTimeout(() => {
                                    this.fade('out', 0.25).then(() => this.stop())
                                }, this.layer.duration - 0.25)
                            }

                        }, this.layer.start)
                    }
                })
            })
        })
    }

    pause() {

    }

    fade(direction: FadeDirection, length: number, to?: number) {
        if (direction === 'out') {
            return new Promise<void>((resolve, reject) => {
                this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.context.currentTime)
                this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + length)
                window.setTimeout(() => resolve(), length * 1000)
            })
        } else {
            return new Promise<void>((resolve, reject) => {
                this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.context.currentTime)
                this.gainNode.gain.exponentialRampToValueAtTime(to ? to : 1, this.context.currentTime + length)
                window.setTimeout(() => resolve(), length * 1000)
            })
        }
    }

    stop() {
        this.buffer.stop();
        this.playing = false;
        console.log('Stopped.');
    }

    onEnded() {
        //as of now only works in Cue Editor
        document.dispatchEvent(new CustomEvent(`finished-layer-${this.id}`))
    }

    toArrayBuffer(buffer: any) {
        const ab = new ArrayBuffer(buffer.length);
        const view = new Uint8Array(ab);
        for (let i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
        }
        return ab;
    }

    /*     playFromBuffer(buffer) {
      this.stop(false);
      this.buffer = buffer;
      this.initSource();
      this.offsetTime = 0;
      this.songDuration = this.buffer.duration;
      this.songStartingTime = this.context.currentTime;
      this.playbackTime = 0;
      this.startPlaying();
    }
  
    startPlaying() {
      this.isPlaying = true;
      this.source.start(0, this.playbackTime);
    } */

}

export { FilePlayer }