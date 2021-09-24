import React, { useEffect, useState } from "react";
import { SpotifyLogin } from "./SpotifyLogin";
import { SpotifyEditor } from "./SpotifyEditor";
import { Application, BackButton, Content, Header, MenuColumn, Overlay } from "./components";
import { db } from "../electron/DB";

const SpotifyCueEditor = (props: any) => {

    console.log(props.match.params.project, parseInt(props.match.params.spotifyCue));

    const spotifyLayer = db.getSpotifyCue(props.match.params.project, props.match.params.spotifyCue)

    const [token, setToken] = useState('');

    useEffect(() => {

        async function getToken() {
            const response = await fetch('http://localhost:5000/auth/token')
                .then(res => res.json())
                .then(data => {
                    console.log(data.access_token);

                    setToken(data.access_token);
                })
        }

        getToken();

    }, []);

    return (
        <>
            <MenuColumn>
                <BackButton link={`/project/${props.match.params.project}`} />
            </MenuColumn>
            <Application>
                <Header>
                    <h1>{spotifyLayer.name}</h1>
                </Header>
                <Content>
                    {(token === '') ? <SpotifyLogin /> : <SpotifyEditor token={token} spotifyLayer={spotifyLayer}/>}
                </Content>
            </Application>
            <Overlay>

            </Overlay>
        </>
    );
}

export { SpotifyCueEditor }