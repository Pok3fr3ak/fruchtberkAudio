import React, { useEffect, useState } from "react";

interface SpotifyPlaybackProps {
    token: string,
    [key: string]: any
}

const SpotifyPlayback = (props: SpotifyPlaybackProps) => {

    const [player, setPlayer] = useState(undefined);

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });


            player.connect();

        };
    }, []);

    return (
        <div>
            <h1>PLAYBACK ACTIVE</h1>
        </div>
    )
}

export { SpotifyPlayback }