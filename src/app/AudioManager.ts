import { Cue, db, Layer } from "../electron/DB";
import { UtilityManager } from "./Utility";
import fs from 'fs'

interface Cache {
    id: number,
    layer: Layer
}

interface DOMCache {
    id: number,
    layer: Layer,
    element: HTMLAudioElement
}

type FadeDirection = 'in' | 'out'

class AudioManager {
    cues: Array<CuePlayer>;

    constructor() {
        this.cues = [];
    }

    addCueToPlayer(cue: Cue, id: number) {
        this.cues.push(new CuePlayer(cue, id));
        this.cues[this.findCue(id)].prepareCue();
    }

    playCue(id: number) {
        this.cues[this.findCue(id)].playCue();
    }

    stopCue(id: number) {
        this.cues[this.findCue(id)].stopCue();
    }

    findCue(id: number): number {
        return this.cues.findIndex(x => {
            return x.id == id;
        })
    }
}

class CuePlayer {
    id: number;
    cueID: number;
    cue: Cue;
    cachedFiles: Array<DOMCache>;
    depricated: Array<HTMLAudioElement>;
    playing: Array<DOMCache>;
    time: number;
    currentlyPlaying: boolean;
    entryPoint: HTMLElement;
    IDs: Set<Number>;
    overalVolume: number;

    timeoutIDs: Array<number>;

    constructor(cue: Cue, id: number) {
        this.id = id
        this.cueID = cue.id;
        this.cue = cue;
        this.cachedFiles = [];
        this.depricated = [];
        this.playing = [];
        this.currentlyPlaying = false;
        this.entryPoint = this.getEntryPoint();
        this.IDs = new Set();
        this.time = 0;
        this.overalVolume = 1;
        this.timeoutIDs = [];
    }

    prepareCue() {
        this.cue.files.forEach((x, i) => {
            let id = this.generateID()
            this.cachedFiles.push({
                id: id,
                layer: x,
                element: this.prepareSingle(x, id)
            })
        })
    }

    prepareSingle(layer: Layer, id: number) {
        /*         let audio = new Audio(`file://${layer.filePath}`)
                audio.setAttribute('id', `${id}`);
                this.entryPoint.appendChild(audio); */
        let audioElement = document.createElement('audio');
        audioElement.setAttribute('id', `${id}`);
        let sourceElement = document.createElement('source');
        sourceElement.setAttribute('src', `file://${layer.filePath}`);

        audioElement.appendChild(sourceElement)

        this.entryPoint.appendChild(audioElement);

        this.play(`${layer.filePath}`)
        //audioElement.play()


        return audioElement
        /* 
                return audio */
    }

    play(path: string) {
        let context = new AudioContext();
        console.log(path);
        
        fs.readFile(path, (err, data) => {
            if(err){
                console.log(err);
                return
            }

            context.decodeAudioData(this.toArrayBuffer(data), (buffer) => {
                let bufferSrc = context.createBufferSource()
                bufferSrc.buffer = buffer
                let gainNode = context.createGain()
                bufferSrc.connect(gainNode)
                gainNode.connect(context.destination)
                gainNode.gain.value = 1
                bufferSrc.start(0)
                console.log('Playing');
            })
        })
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


    toArrayBuffer(buffer: any) {
        const ab = new ArrayBuffer(buffer.length);
        const view = new Uint8Array(ab);
        for (let i = 0; i < buffer.length; ++i) {
          view[i] = buffer[i];
        }
        return ab;
      }

    playCue() {
        console.log("Starting Cue: ", this.cachedFiles);

        console.log(`Playin Cue ${this.id}`);

        if (this.currentlyPlaying === false) {

            this.cachedFiles.forEach(x => {
                //console.log(this.time, x.layer.start);
                let id = window.setTimeout(() => {
                    console.log(this.time, x.layer.start);

                    this.cachedFiles.splice(this.cachedFiles.indexOf(x), 1);
                    this.playFile(x.layer, x.element)

                    if (x.layer.fadeIN_Active) {
                        this.fade(x.element, x.layer.fadeIN, 'in');
                    }

                    if (x.layer.fadeOUT_Active) {
                        let fadeOutId = window.setTimeout(() => {
                            this.fade(x.element, x.layer.fadeOUT, 'out')
                        }, (x.layer.duration - x.layer.fadeOUT))
                        this.timeoutIDs.push(fadeOutId);
                    }

                    if (x.layer.loop === false) {
                        let stopID = window.setTimeout(() => {
                            x.element.pause();
                            x.element.remove();
                            this.playing.splice(this.playing.indexOf(x), 1)
                            if (this.cachedFiles.length === 0 && this.playing.length === 0) {
                                this.stopCue();
                            }
                        }, x.layer.duration)
                    }

                    this.playing.push(x);
                }, x.layer.start)

                this.timeoutIDs.push(id)
            })
            //this.intervalFunctionID = window.setInterval(this.intervalFunction.bind(this), 10);
            this.currentlyPlaying = true;
        } else {
            this.stopCue();
            this.playCue();
        }
    }

    stopCue() {
        console.log(`Stopped Cue ${this.id}`);

        this.currentlyPlaying = false;
        this.timeoutIDs.forEach(x => window.clearTimeout(x));

        this.playing.forEach(x => {
            x.element.pause();
            x.element.remove();
        })

        this.cachedFiles.forEach(x => {
            x.element.remove();
        })

        this.playing = [];
        this.cachedFiles = [];
    }

    playFile(data: Layer, el: HTMLAudioElement) {
        if (data.fadeIN_Active) {
            el.volume = 0;
        } else {
            el.volume = data.volume;
        }
        el.play();
    }

    fade(el: HTMLAudioElement, duration: number, dir: FadeDirection) {
        let interval: number;
        let amount = 1 / (duration / 5);

        console.log(`Init fade ${dir}`);

        if (dir === 'in') {
            interval = window.setInterval(() => {
                el.volume = Math.min(1, el.volume + amount)
            }, 5)
        } else {
            interval = window.setInterval(() => {
                el.volume = Math.max(0, el.volume - amount)
            }, 5)
        }

        window.setTimeout(() => {
            window.clearInterval(interval);
        }, duration)
    }

    generateID(): number {
        let unique = Math.floor(Math.random() * 1000);

        while (this.IDs.has(unique)) {
            unique = Math.floor(Math.random() * 1000);
        }

        this.IDs.add(unique);

        return unique;
    }

    getEntryPoint() {
        return document.getElementById('audioManagerEntry') || document.createElement('div');
    }

}

export const audioManager = new AudioManager();