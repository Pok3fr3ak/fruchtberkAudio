import { Cue } from "../../electron/DB";
import { DOMCache } from "../customInterfaces";
import { FilePlayer } from "./FilePlayer";

class CuePlayer {
    id: number;
    cueID: number;
    cue: Cue;
    files: Array<DOMCache>;
    currentlyPlaying: boolean;
    IDs: Set<Number>;
    overalVolume: number;

    constructor(cue: Cue, id: number) {
        this.id = id
        this.cueID = cue.id;
        this.cue = cue;
        this.files = [];
        this.currentlyPlaying = false;
        this.IDs = new Set();
        this.overalVolume = 1;

        document.addEventListener(`finished-layer-${this.id}`, () => {
            if (this.checkStatus() === false) document.dispatchEvent(new CustomEvent(`finishedPlaying-${this.id}`))
        })
    }

    prepareCue() {
        this.cue.files.forEach((x, i) => {
            let id = this.generateID()
            this.files.push({
                id: id,
                layer: x,
                player: new FilePlayer(x, this.id)
            })
        })
    }

    playCue() {
        if (this.currentlyPlaying === false) {

            this.files.forEach(x => {
                if (x.layer.fadeOUT_Active === true) {
                    x.player.play().then(() => {
                        setTimeout(() => {
                            x.player.fade('out', x.layer.fadeOUT / 1000).then(() => x.player.stop())
                        }, x.layer.duration - x.layer.fadeOUT)
                    });
                } else {
                    x.player.play(true)
                }
            })
            this.currentlyPlaying = true;
        } else {
            this.stopCue();
            this.playCue();
        }
    }

    stopCue() {
        this.currentlyPlaying = false;

        this.files.forEach(x => {
            x.player.stop();
        })
    }

    checkStatus() {
        let status: boolean;
        this.files.forEach(x => {
            status = x.player.playing;
        })

        return status
    }


    generateID(): number {
        let unique = Math.floor(Math.random() * 1000);

        while (this.IDs.has(unique)) unique = Math.floor(Math.random() * 1000);

        this.IDs.add(unique);
        return unique;
    }

}

export { CuePlayer }