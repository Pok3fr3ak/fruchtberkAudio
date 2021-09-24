import { ipcRenderer } from "electron"
import React from "react"

const SpotifyLogin = () => {
    return (
        <div>
            <a onClick={()=>{
                ipcRenderer.send('SpotifyLogin')
            }}>LOGIN WITH SPOTIFY</a>
        </div>
    )
}

export { SpotifyLogin }