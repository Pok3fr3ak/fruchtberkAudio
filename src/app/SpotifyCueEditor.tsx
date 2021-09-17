import React, { useEffect, useState } from "react";
import { SpotifyLogin } from "./SpotifyLogin";
import { SpotifyPlayback } from "./SpotifyPlayback";

const SpotifyCueEditor = () => {

    const [token, setToken] = useState('');

    useEffect(() => {

        async function getToken() {
            const response = await fetch('http://localhost:5000/auth/token')
                .then(res => res.json())
                .then(data => {
                    setToken(data.access_token);
                })
        }

        getToken();

    }, []);

    return (
        <>
            <h1>SPOTIFY CUE EDITOR</h1>
            {(token === '') ? <SpotifyLogin /> : <SpotifyPlayback token={token} />}
        </>
    );
}

export { SpotifyCueEditor }