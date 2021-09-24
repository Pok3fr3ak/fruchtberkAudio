import { Cue, db, SpotifyCue } from "../../electron/DB";
import React, { useEffect, useState } from "react"
import { audioManager } from "../AudioManager/AudioManager";
import { Application, BackButton, Content, CustomButton, Header, MenuColumn, Overlay } from '../components';
import { MdAdd, MdMenu, MdPause, MdPlayArrow, MdSave } from "react-icons/md";
import { SelectionContextInterface } from "../customInterfaces";
import { Selector } from "./Selector";
import { Group } from "./Group";
import { ipcRenderer } from "electron";

export const SelectionContext = React.createContext<SelectionContextInterface>({
    selectionActive: false,
    setSelectionActive: (selection: boolean) => { },
    selected: 0,
    setSelected: (num: number) => { },
    currCue: null,
    setCurrCue: (cue: Cue | null) => { },
    currSpotifyCue: null,
    setCurrSpotifyCue: (spotifyCue: SpotifyCue | null) => { }
});

export const Player = (props: any) => {

    const project = db.getProject(`${props.match.params.project}`)
    const usedIDs = new Set<number>();

    const [numberOfPairs, setNumberOfPairs] = useState(1);

    const pairs: Array<any> = [...Array(numberOfPairs)].map((x, i) => i);

    const [selectionActive, setSelectionActive] = useState(false);
    const [selected, setSelected] = useState<number>(0);
    const [currCue, setCurrCue] = useState<Cue | null>(null);
    const [currSpotifyCue, setCurrSpotifyCue] = useState<SpotifyCue | null>();

    const [playing, setPlaying] = useState(false);

    const selectionValue = { selectionActive, setSelectionActive, selected, setSelected, currCue, setCurrCue, currSpotifyCue, setCurrSpotifyCue };

    const SpotifyCuePlayCall = (e: CustomEventInit) => {
        console.log(props.currPlaying, props.localIndex, props.currPlaying === props.localIndex);

        if (props.currPlaying === props.localIndex) {
            console.log('CALLING TO PLAY');
            ipcRenderer.send('AddedSpotifyPlayer', e.detail.uri)
        }

    }

    useEffect(() => {
        document.addEventListener('AddedSpotifyPlayer', SpotifyCuePlayCall)

        return () => {
            document.removeEventListener('AddedSpotifyPlayer', SpotifyCuePlayCall)
        }
    }, [])

    return (
        <>
            <MenuColumn>
                <BackButton link="/player" />
                <CustomButton
                    iconColor="white"
                    size="2.5em"
                >
                    <MdMenu />
                </CustomButton>
            </MenuColumn>
            <SelectionContext.Provider value={selectionValue}>
                <Application>
                    <Header>
                        <h1>David Guetta: {project.name}</h1>
                        <div style={{ display: "flex" }}>
                            <CustomButton
                                onClick={() => {
                                    setPlaying(!playing);
                                    if (playing === true) {
                                        audioManager.stopAll();
                                        console.log('Stopped all');
                                    }
                                }}
                                class="row"
                                iconColor="white"
                                size="2.5em"
                            >
                                {
                                    playing ?
                                        <MdPause />
                                        :
                                        <MdPlayArrow />}
                            </CustomButton>
                            <CustomButton
                                iconColor="white"
                                size="2.5em"
                                class="row">
                                <MdSave />
                            </CustomButton>
                        </div>
                    </Header>
                    <Content>
                        <div id="assembler">

                            {
                                pairs.map((x, i) => {
                                    return (
                                        <Group
                                            key={i + 1}
                                            index={i + 1}
                                            playing={playing}
                                        />
                                    )
                                })
                            }
                            <CustomButton
                                onClick={() => setNumberOfPairs(numberOfPairs + 1)}
                                iconColor="white"
                                size="2.5em"
                                class="row mx-auto"
                            >
                                <MdAdd />
                            </CustomButton>
                        </div>
                    </Content>
                </Application>
                <Overlay
                    active={selectionActive ? true : false}
                >
                    <Selector
                        project={project}
                    />
                </Overlay>
            </SelectionContext.Provider>
        </>
    )
}
