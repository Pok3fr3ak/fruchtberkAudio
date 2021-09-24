import { SpotifyCue } from "../../electron/DB"

class SpotifyPlayer {
    spotifyCue: SpotifyCue
    id: number

    constructor(spotifyCue: SpotifyCue, id: number) {
        this.spotifyCue = spotifyCue;
        this.id = id;


    }

    playCue() {
        document.dispatchEvent(new CustomEvent('AddedSpotifyPlayer', {
            detail: {
                uri: this.spotifyCue.playlist.uri
            }
        }))
    }

    stopCue() {

    }

    prepareCue() {

    }
}

export { SpotifyPlayer }