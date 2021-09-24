import React, { useEffect, useState } from "react";
import { MdAdd, MdClear } from "react-icons/md";
import { db, SpotifyCue } from "../../electron/DB";
import { CustomButton } from "../components";
import { SpotifyPlaybackProps, SpotifyData, PlaylistData } from "../customInterfaces";

const SpotifyEditor = (props: SpotifyPlaybackProps) => {

    const [spotifyData, setSpotifyData] = useState<SpotifyData>(null);
    const [active, setActive] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData>();
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        fetch(`https://api.spotify.com/v1/me/playlists?limit=50`, {
            headers: {
                'Authorization': `Bearer ${props.token}`
            }
        }).then(res => res.json()).then(data => {
            setOffset(offset => offset + 50);
            setSpotifyData(data)
        })
    }, [])


    useEffect(() => {
        if (props.token === undefined) return;
        if (props.spotifyLayer.playlist === undefined) return;
        if (spotifyData !== null && spotifyData !== undefined) {
            console.log('Searching if Playlist is set');

            const previouslySelected = spotifyData.items.find(x => {
                return x.uri === props.spotifyLayer.playlist.uri
            })

            if (previouslySelected !== undefined) setSelectedPlaylist(previouslySelected)
        }


    }, [spotifyData])

    useEffect(() => {
        if (selectedPlaylist !== undefined && selectedPlaylist !== null) {
            console.log('Setting Playlist...');
            props.spotifyLayer.addPlaylist(selectedPlaylist.name, selectedPlaylist.uri)
            db.save();
        }
    }, [selectedPlaylist])

    return (
        <div>
            <>
                {
                    spotifyData !== null ?
                        <>
                            {
                                selectedPlaylist ?
                                    <>
                                        <CustomButton
                                            onClick={() => {
                                                setSelectedPlaylist(null);
                                            }}
                                            size="2.5em"
                                            class="ml-auto"
                                        >
                                            <MdClear />
                                        </CustomButton>
                                        <div className="selectedPlaylist">
                                            <div>
                                                <h1>{selectedPlaylist.name}</h1>
                                                <p>{selectedPlaylist.tracks.total} Tracks</p>
                                            </div>
                                            <div>
                                                <img src={selectedPlaylist.images[0] ? selectedPlaylist.images[0].url : ''} alt="" />
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <CustomButton
                                            size="4em"
                                            onClick={() => {
                                                setActive(true)
                                            }}
                                        >
                                            <MdAdd />
                                        </CustomButton>
                                    </>
                            }
                            {
                                active ?
                                    <>{
                                        spotifyData.items.map((x, i) => {
                                            return (
                                                <p
                                                    key={`playlists-${i}`}
                                                    onClick={() => {
                                                        setSelectedPlaylist(x)
                                                        setActive(false)
                                                    }}
                                                    style={{ color: "white" }}
                                                >{x.name}</p>
                                            )
                                        })
                                    }
                                        <CustomButton
                                            onClick={() => {
                                                fetch(`https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=50`, {
                                                    headers: {
                                                        'Authorization': `Bearer ${props.token}`
                                                    }
                                                }).then(res => res.json()).then((data: SpotifyData) => {
                                                    setOffset(offset => offset + 50);
                                                    let newData = spotifyData;
                                                    data.items.forEach(x => {
                                                        newData.items.push(x);
                                                    })
                                                    setSpotifyData(newData)
                                                    setActive(false);
                                                    setActive(true)
                                                })
                                            }}
                                            class="text"
                                        >
                                            Load More
                                        </CustomButton>
                                    </>
                                    :
                                    <></>
                            }
                        </>
                        :
                        <></>
                }
            </>
        </div>
    )
}

export { SpotifyEditor }