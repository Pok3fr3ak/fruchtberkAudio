import React, { useEffect, useState } from "react";
import { SpotifyLogin } from "./SpotifyLogin";
import { SpotifyEditor } from "./SpotifyEditor";
import { Application, BackButton, Content, Header, MenuColumn, Overlay } from "./components";
import { ipcRenderer } from "electron";

const SpotifyCueEditor = () => {

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
                <BackButton link={`/`}/>
            </MenuColumn>
            <Application>
                <Header>
                    <h1>SPOTIFY CUE EDITOR</h1>
                    <button onClick={()=>{
                        ipcRenderer.send('newTokenPls')
                    }}></button>
                </Header>
                <Content>
                    {(token === '') ? <SpotifyLogin /> : <SpotifyEditor token={token} />}
                </Content>
            </Application>
            <Overlay>

            </Overlay>
        </>
    );
}

export { SpotifyCueEditor }