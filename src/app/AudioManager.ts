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
        //this.cleanUP();
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

    intervalFunction: any;
    starterFunctionIDs: Array<number>;
    intervalFunctionID: any;

    cleanUP: any;

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
        this.starterFunctionIDs = [];
        //this.intervalFunctionIDs = [];

        this.intervalFunction = () => {
            //this.time += 10;
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
            let id = this.generateID()
            this.cachedFiles.push({
                id: id,
                layer: x,
                element: this.prepareSingle(x, id)
            })
        })
    }


    prepareSingle(layer: Layer, id: number) {
        let audioElement = document.createElement('audio');
        audioElement.setAttribute('id', `${id}`);
        let sourceElement = document.createElement('source');
        sourceElement.setAttribute('src', `file://${layer.filePath}`);

        audioElement.appendChild(sourceElement)

        this.entryPoint.appendChild(audioElement);
        
        return audioElement
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
                    const y = {
                        id: x.id,
                        layer: x.layer,
                        element: document.getElementById(`${x.id}`) as HTMLAudioElement
                    }
                    this.playFile(x.layer, y.element)
                    this.playing.push(y);
                }, x.layer.start)

                this.starterFunctionIDs.push(id)
            })

            //this.starterFunctionID = window.setInterval(this.starterFunction.bind(this), 10);
            this.intervalFunctionID = window.setInterval(this.intervalFunction.bind(this), 10);
            this.currentlyPlaying = true;
        } else {
            this.stopCue();
            this.playCue();
        }
        //console.log(this.cachedFiles, this.playing);
    }

    stopCue() {
        console.log(`Stopped Cue ${this.id}`);

        this.currentlyPlaying = false;
        this.starterFunctionIDs.forEach(x => window.clearTimeout(x));
        //window.clearInterval(this.starterFunctionID);
        //window.clearInterval(this.intervalFunctionID);

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
        }
        el.play();
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