import React, { useEffect, useState } from "react";
import { MdAdd, MdClear } from "react-icons/md";
import { CustomButton } from "./components";

interface SpotifyPlaybackProps {
    token: string,
    [key: string]: any
}

interface SpotifyData {
    href: string,
    items: Array<PlaylistData>,
    limit: number,
    next: any,
    offset: number,
    previous: any,
    total: number
}

interface PlaylistData {
    collaborative: boolean,
    description: string,
    external_urls: any
    href: string,
    id: string,
    images: Array<{
        height: number,
        url: string,
        width: number
    }>,
    name: string,
    owner: {
        display_name: string,
        external_urls: any,
        href: string,
        id: string,
        type: string,
        uri: string
    }
    primaryColor: any,
    public: boolean,
    snapshot_id: string,
    tracks: {
        href: string,
        total: number
    },
    type: string,
    uri: string
}

const SpotifyEditor = (props: SpotifyPlaybackProps) => {

    const [spotifyData, setSpotifyData] = useState<SpotifyData>(null);
    const [active, setActive] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData>();

    useEffect(() => {
        fetch(`https://api.spotify.com/v1/me/playlists`, {
            headers: {
                'Authorization': `Bearer ${props.token}`
            }
        }).then(res => res.json()).then(data => {
            console.log(data);
            setSpotifyData(data)
        })
    }, [])

    return (
        <div>

            <>
                {
                    spotifyData !== null ?
                        <>
                            {
                                selectedPlaylist ?
                                    <>
                                        <div className="selectedPlaylist">
                                            <div>
                                                <p>{selectedPlaylist.name}</p>
                                                <CustomButton
                                                    onClick={() => {
                                                        setSelectedPlaylist(null);
                                                    }}
                                                    size="2.5em"
                                                >
                                                    <MdClear />
                                                </CustomButton>
                                            </div>
                                            <div>
                                                <p>{selectedPlaylist.tracks.total} Tracks</p>
                                            </div>
                                            <img src={selectedPlaylist.images[0].url} alt="" />
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
                                    spotifyData.items.map(x => {
                                        return (
                                            <p
                                                onClick={() => {
                                                    setSelectedPlaylist(x)
                                                    setActive(false)
                                                }}
                                                style={{ color: "white" }}
                                            >{x.name}</p>
                                        )
                                    })
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