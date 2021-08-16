import { Cue, db, Layer } from "@/electron/DB";
import { UtilityManager } from "./Utility";

interface Cache {
    id: number,
    layer: Layer
}

interface DOMCache {
    id: number,
    layer: Layer,
    element: HTMLAudioElement
}

class AudioManager {
    cues: Array<CuePlayer>;

    constructor() {
        this.cues = [];
    }

    addCueToPlayer(cue: Cue) {
        this.cues.push(new CuePlayer(cue));
        this.cues[this.findCue(cue.id)].prepareCue();
    }

    playCue(cue:Cue){
        this.cues[this.findCue(cue.id)].playCue();
    }

    stopCue(cue: Cue){
        this.cues[this.findCue(cue.id)].stopCue();
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
    cachedFiles: Array<Cache>;
    playing: Array<DOMCache>;
    
    currentlyPlaying: boolean;
    entryPoint: HTMLElement;
    IDs: Set<Number>;
    time: number;
    overalVolume: number;
    
    starterFunction: any;
    intervalFunction: any;
    starterFunctionID: any;
    intervalFunctionID: any;

    constructor(cue: Cue) {
        this.id = UtilityManager.getNewID();
        this.cueID = cue.id;
        this.cue = cue;
        this.cachedFiles = [];
        this.playing = [];
        this.currentlyPlaying = false;
        this.entryPoint = this.getEntryPoint();
        this.IDs = new Set();
        this.time = 0;
        this.overalVolume = 1;
        this.starterFunction = () => {
            this.cachedFiles.forEach(x => {
                //console.log(this.time, x.layer.start);
                if (this.time >= x.layer.start) {
                    //console.log('New File Playing');
                    this.cachedFiles.splice(this.cachedFiles.indexOf(x), 1);
                    const y = {
                        id: x.id,
                        layer: x.layer,
                        element: document.getElementById(`${x.id}`) as HTMLAudioElement
                    }
                    this.playFile(x.layer, y.element)
                    this.playing.push(y);
                }
            })
        }
        this.intervalFunction = () => {
            this.time += 10;
            this.playing.forEach(x => {
                if (x.element.currentTime * 1000 <= x.layer.fadeIN) {
                    x.element.volume += (((x.layer.volume / 100) / x.layer.fadeIN) * 10) * this.overalVolume;
                } else if (x.element.currentTime * 1000 >= x.layer.duration - x.layer.fadeOUT && x.element.currentTime * 1000 <= x.layer.duration) {
                    x.element.volume -= (((x.layer.volume / 100) / x.layer.fadeOUT) * 10) * this.overalVolume;
                } else {
                    x.element.volume = (x.layer.volume / 100) * this.overalVolume;
                }

                //console.log(x, x.element.currentTime * 1000 , x.layer.duration);
                if (x.layer.loop == false && x.element.currentTime * 1000 >= x.layer.duration) {
                    x.element.pause();
                    x.element.remove();
                    this.playing.splice(this.playing.indexOf(x), 1);
                    if (this.cachedFiles.length == 0 && this.playing.length == 0) {
                        this.stopCue();
                        //console.log(this.time);
                    }
                }
            })
        }
    }

    prepareCue() {
        this.cue.files.forEach((x, i) => {
            this.cachedFiles.push({
                id: this.generateID(),
                layer: x
            })
        })

        this.prepareAudio();
    }

    playCue() {
        if (this.currentlyPlaying === false) {
            this.starterFunctionID = window.setInterval(this.starterFunction.bind(this), 10);
            this.intervalFunctionID = window.setInterval(this.intervalFunction.bind(this), 10);
            this.currentlyPlaying = true;
        } else {
            this.stopCue();
            this.playCue();
        }
        //console.log(this.cachedFiles, this.playing);
    }

    stopCue() {
        //console.trace();
        this.time = 0;
        this.currentlyPlaying = false;
        window.clearInterval(this.starterFunctionID);
        window.clearInterval(this.intervalFunctionID);
        //console.log(this.cachedFiles, this.playing);
    }

    playFile(data: Layer, el: HTMLAudioElement) {
        if (data.fadeIN_Active) {
            el.volume = 0;
        }
        el.play();
    }

    prepareAudio() {
        this.cachedFiles.forEach(x => {
            this.prepareSingle(x)
        })
    }

    prepareSingle(cachedFile: Cache) {
        let audioElement = document.createElement('audio');
        audioElement.setAttribute('id', `${cachedFile.id}`);
        let sourceElement = document.createElement('source');
        sourceElement.setAttribute('src', `file://${cachedFile.layer.filePath}`);

        audioElement.appendChild(sourceElement)

        this.entryPoint.appendChild(audioElement);
    }

    generateID(): number {
        let unique = Math.floor(Math.random() * 1000);

        while(this.IDs.has(unique)){
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