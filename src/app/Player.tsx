import { Cue, db, Project } from "@/electron/DB";
import React, { useContext, useEffect, useState } from "react"
import { audioManager } from "./AudioManager";
import { Application, BackButton, Content, CueCard, Header, MenuColumn, Overlay, ToolColumn } from './components';

interface TriggerInfo {
    trigger: boolean
    lastPlaying: number | null,
    toPlay: number,
}

interface SelectionContextInterface {
    selectionActive: boolean,
    setSelectionActive: (selection: boolean) => void,
    selected: number,
    setSelected: (num: number) => void,
    currCue: Cue | null,
    setCurrCue: (cue: Cue | null) => void,
}

const SelectionContext = React.createContext<SelectionContextInterface>({
    selectionActive: false,
    setSelectionActive: (selection: boolean) => { },
    selected: 0,
    setSelected: (num: number) => { },
    currCue: null,
    setCurrCue: (cue: Cue | null) => { },
});

export const Player = (props: any) => {

    const project = db.getProject(`${props.match.params.project}`)
    const usedIDs = new Set<number>();

    const [numberOfPairs, setNumberOfPairs] = useState(1);

    const pairs: Array<any> = [...Array(numberOfPairs)].map((x, i) => i);

    const [selectionActive, setSelectionActive] = useState(false);
    const [selected, setSelected] = useState<number>(0);
    const [currCue, setCurrCue] = useState<Cue | null>(null);

    const [playing, setPlaying] = useState(false);

    const selectionValue = { selectionActive, setSelectionActive, selected, setSelected, currCue, setCurrCue };

    return (
        <>
            <MenuColumn>
                <BackButton link="/player" />
            </MenuColumn>
            <SelectionContext.Provider value={selectionValue}>
                <Application>
                    <Header>
                        <h1>David Guetta: {project.name}</h1>
                        <div>
                            <button
                                onClick={() => {
                                    setPlaying(!playing);
                                }}
                            >{playing ? 'Pause' : 'Play'}</button>
                            <button>Save</button>
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
                            <button id="addLayer" onClick={() => setNumberOfPairs(numberOfPairs + 1)}>ADD LAYER</button>
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

interface GroupProps {
    index: number,
    playing: boolean,
}

interface SelectedCues {
    cue: Cue,
    id: number
}

const Group = (props: GroupProps) => {
    const playing = props.playing;

    const [numberOfNodes, setNumberOfNodes] = useState(1);
    const [triggerSwitch, setTriggerSwitch] = useState<TriggerInfo>({
        trigger: false,
        lastPlaying: null,
        toPlay: 0
    });
    const [currPlaying, setCurrPlaying] = useState<number | null>(null);
    const [selectedCues, setSelectedCues] = useState<Array<SelectedCues | null>>([]);

    const Nodes = [...Array(numberOfNodes)].map((x, i) => i);

    useEffect(() => {
        //Last Playing is fucked currently
        if (triggerSwitch.trigger === true) {
            setTriggerSwitch({
                trigger: false,
                toPlay: triggerSwitch.toPlay,
                lastPlaying: currPlaying
            });
            setCurrPlaying(triggerSwitch.toPlay)
        }
    }, [triggerSwitch])

    useEffect(() => {
        //Call to Audio Manager to play the right cue and stop the other
        //With crossfade
        if (currPlaying !== null && currPlaying !== undefined) {
            //console.log(currPlaying, selectedCues[currPlaying]);
            let cue = selectedCues[currPlaying];
            if (cue !== null) {
                audioManager.addCueToPlayer(cue.cue, cue.id);
                audioManager.playCue(cue.id);
            }

            if (triggerSwitch.lastPlaying !== null) {
                let lastCue = selectedCues[triggerSwitch.lastPlaying];
                if (lastCue !== null && lastCue !== undefined) audioManager.stopCue(lastCue.id)
            }

        }
    }, [currPlaying])

    useEffect(() => {
        if (playing === true) {
            setCurrPlaying(0);
        } else if (playing === false) {
            setCurrPlaying(null)
        }
    }, [playing])

    return (
        <div className="nodeGroup">
            {
                Nodes.map((x, i, arr) => {
                    return (
                        <>
                            <Node
                                index={props.index * 30 + i}
                                localIndex={i}
                                currPlaying={currPlaying}
                                selectedCues={selectedCues}
                                setSelectedCues={setSelectedCues}
                            />
                            {
                                i < arr.length - 1 ?
                                    <Switcher
                                        index={i}
                                        active={currPlaying === null ? true : false}
                                        direction={typeof triggerSwitch.toPlay === 'number' && triggerSwitch.toPlay > i ? 'left' : 'right'}
                                        triggerSwitch={triggerSwitch}
                                        setTriggerSwitch={setTriggerSwitch}
                                    />
                                    :
                                    <></>
                            }
                        </>
                    )
                })
            }
            <button onClick={() => setNumberOfNodes(numberOfNodes + 1)}>+</button>
        </div>
    )
}

interface NodeProps {
    index: number,
    localIndex: number,
    currPlaying: number | null,
    selectedCues: Array<SelectedCues | null>,
    setSelectedCues: (selCue: Array<SelectedCues | null>) => void
}

const Node = (props: NodeProps) => {
    const selectedCues = props.selectedCues;
    const setSelectedCues = props.setSelectedCues;

    const id: number = db.getID(`node-${props.index}`) || db.addID(`node-${props.index}`)

    const [cue, setCue] = useState<Cue>();
    const [active, setActive] = useState(false);
    const [time, setTime] = useState(0);

    const { selectionActive, setSelectionActive, selected, setSelected, currCue, setCurrCue } = useContext(SelectionContext);

    useEffect(() => {
        if (selected !== props.index) {
            setActive(false)
        }
    }, [selected])

    useEffect(() => {
        if (selected === props.index && active === false) {
            setSelected(0)
            setSelectionActive(false)
        }
    }, [active])

    useEffect(() => {
        if (selectionActive === false) {
            setActive(false)
        }
    }, [selectionActive])

    useEffect(() => {
        if (selected === props.index) {
            if (currCue !== null && currCue !== undefined) {
                setCue(currCue);
                let newCueArr = selectedCues;
                newCueArr[props.localIndex] = { cue: currCue, id: id }
                setSelectedCues(newCueArr)
            }
            setCurrCue(null)
        }
    }, [currCue])

    useEffect(() => {
        let timer: any;
        console.log(`Playing something new: ${props.currPlaying}`);
        if (props.currPlaying === props.localIndex){
            timer = window.setInterval(()=> {
                setTime(time => time + 1)
            }, 1000)
        }

        return () => window.clearInterval(timer);
    }, [props.currPlaying])

    return (
        <div
            className={`${active ? 'active' : 'idle'} node ${props.currPlaying === props.localIndex ? 'playing' : ''}`}
            onClick={() => {
                /* selector(lID) */
                setSelected(props.index);
                setActive(!active);
                if (selectionActive === false && active === false) {
                    setSelectionActive(true)
                }
            }}>
            {
                cue ? <>
                    <h2>{cue.name}</h2>
                    <p className="description">{cue.description}</p>
                    <div className="footer">
                        <p>Play/Pause</p>
                        <div className="time">
                            <p>{props.currPlaying === props.localIndex ? time : cue.getLength()}</p>
                            <p className="indicator"> </p>
                        </div>
                    </div>
                </>
                    :
                    <></>
            }
        </div>
    )
}

interface SwitcherProps {
    direction: string,
    index: number,
    triggerSwitch: TriggerInfo,
    active: boolean
    setTriggerSwitch: (obj: any) => void
}

const Switcher = (props: SwitcherProps) => {
    const triggerSwitch: TriggerInfo = props.triggerSwitch;
    const direction = props.direction;

    return (
        <button
            onClick={
                () => props.setTriggerSwitch({
                    trigger: true,
                    toPlay: direction === 'right' ? props.index + 1 : props.index,
                    lastPlaying: props.index
                })}
            disabled={props.active}
        >{direction}</button>
    )
}

const Selector = (props: any) => {

    const project: Project = props.project;
    const { selectionActive, setSelectionActive, setCurrCue } = useContext(SelectionContext);

    return (
        <ul id="selector">
            <button onClick={() => setSelectionActive(false)}>X</button>
            {
                project.cueList.map((x, i) => {
                    return (
                        <li
                            key={i}
                            onClick={(ev) => {
                                setCurrCue(x)
                                setSelectionActive(false)
                            }}
                        >
                            <CueCard
                                cue={x}
                                optionalClass="max-width-50ch"
                            />
                        </li>
                    )
                })
            }
        </ul>
    )
}