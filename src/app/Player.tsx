import { Cue, db, Project } from "../electron/DB";
import React, { useContext, useEffect, useState } from "react"
import { audioManager } from "./AudioManager";
import { Application, BackButton, Content, CueCard, CustomButton, Header, MenuColumn, Overlay, ToolColumn } from './components';
import { MdAdd, MdMenu, MdArrowForward, MdArrowBack, MdPause, MdPlayArrow, MdSave, MdClear } from "react-icons/md";

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
                                    if(playing === true){
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
                                key={`node-key-${props.index * 30 + i}`}
                                index={props.index * 30 + i}
                                localIndex={i}
                                currPlaying={currPlaying}
                                setCurrPlaying={setCurrPlaying}
                                selectedCues={selectedCues}
                                setSelectedCues={setSelectedCues}
                            />
                            {
                                i < arr.length - 1 ?
                                    <Switcher
                                        key={`switcher-key-${i}`}
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
            <CustomButton
                onClick={() => setNumberOfNodes(numberOfNodes + 1)}
                iconColor="white"
                size="2.5em"
                class="row"
            >
                <MdAdd />
            </CustomButton>
        </div>
    )
}

interface NodeProps {
    index: number,
    localIndex: number,
    currPlaying: number | null,
    setCurrPlaying: (arg: number | null) => void
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
        let timer: number;
        console.log(`Playing something new: ${props.currPlaying}`);
        if (props.currPlaying === props.localIndex) {
            timer = window.setInterval(() => {
                setTime(time => time + 1)
            }, 1000)
        }

        return () => window.clearInterval(timer);
    }, [props.currPlaying])

    return (
        <div
            className={`${active ? 'active' : 'idle'} node ${props.currPlaying === props.localIndex ? 'playing' : ''}`}
        >
            {
                cue ?
                    <>
                        <div className="flex row space-between header">
                            <h2>{cue.name}</h2>

                            <CustomButton
                                class="clearCue row"
                                size="2em"
                            >
                                <MdClear />
                            </CustomButton>
                        </div>

                        <p className="description">{cue.description}</p>

                        <div className="footer">
                            <CustomButton
                                iconColor="white"
                                size="2em"
                                class="minor"
                                onClick={() => {
                                    if(props.currPlaying === props.localIndex){
                                        audioManager.stopCue(selectedCues[props.localIndex].id)
                                        props.setCurrPlaying(null)
                                    } else {
                                        props.setCurrPlaying(props.localIndex)
                                    }

                                }}
                            >
                                {
                                    props.currPlaying === props.localIndex ? <MdPause /> : <MdPlayArrow />
                                }
                            </CustomButton>
                            <div className="time">
                                <p>{props.currPlaying === props.localIndex ? time : cue.getLength()}</p>
                                <p className="indicator"> </p>
                            </div>
                        </div>
                    </>
                    :
                    <div style={{ flex: "1", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <p
                            style={{ flex: "1", textAlign: "center" }}
                            onClick={() => {
                                /* selector(lID) */
                                setSelected(props.index);
                                setActive(!active);
                                if (selectionActive === false && active === false) {
                                    setSelectionActive(true)
                                }
                            }}>
                            Select a Cue
                        </p>
                    </div>
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
        <CustomButton
            onClick={
                () => props.setTriggerSwitch({
                    trigger: true,
                    toPlay: direction === 'right' ? props.index + 1 : props.index,
                    lastPlaying: props.index
                })}
            disabled={props.active}
            iconColor="white"
            size="2.5em"
        >
            {
                direction === 'right' ? <MdArrowForward /> : <MdArrowBack />}
        </CustomButton>

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