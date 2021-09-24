import { Cue, db, Layer, SpotifyCue } from "../../electron/DB";
import { DOMCache, FadeDirection } from "../customInterfaces";
import { CuePlayer } from "./CuePlayer";
import { SpotifyPlayer } from "./SpotifyPlayer";


class AudioManager {
    cues: Array<CuePlayer | SpotifyPlayer>;

    constructor() {
        this.cues = [];
    }

    addCueToPlayer(id: number, cue?: Cue, spotifyCue?: SpotifyCue) {
        if (this.findCue(id) === -1) {
            if(cue){
                this.cues.push(new CuePlayer(cue, id));
                this.cues[this.findCue(id)].prepareCue();
            } else if(spotifyCue){
                this.cues.push(new SpotifyPlayer(spotifyCue, id))
            }
        }
    }

    playCue(id: number) {
        this.cues[this.findCue(id)].playCue();
    }

    stopCue(id: number) {
        this.cues[this.findCue(id)].stopCue();
    }

    stopAll(){
        this.cues.forEach(x => {
            x.stopCue();
        })
    }

    findCue(id: number): number {
        return this.cues.findIndex(x => {
            return x.id == id;
        })
    }
}

export const audioManager = new AudioManager();

export { AudioManager, CuePlayer}