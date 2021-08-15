import { Cue, db, Project } from "@/electron/DB";
import React, { useContext, useEffect, useState } from "react"
import { Application, BackButton, Content, Header, MenuColumn, Overlay, ToolColumn } from './components';

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
    const [currCue, setCurrCue] = useState<Cue | null>(null)

    const selectionValue = { selectionActive, setSelectionActive, selected, setSelected, currCue, setCurrCue };

    return (
        <>
            <MenuColumn>
                <BackButton link="/player" />
            </MenuColumn>
            <SelectionContext.Provider value={selectionValue}>
            <Application>
                <Header>

                </Header>
                <Content>
                    <div id="assembler">

                            {
                                pairs.map((x, i) => {
                                    return (
                                        <Group
                                            key={i}
                                            index={i + 1}
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

const Group = (props: any) => {

    const [numberOfNodes, setNumberOfNodes] = useState(1);
    const [triggerSwitch, setTriggerSwitch] = useState(false);

    const Nodes = [...Array(numberOfNodes)].map((x, i) => i);

    useEffect(()=>{
        if(triggerSwitch === true){
            console.log(triggerSwitch);
            setTriggerSwitch(false);
        }
    },[triggerSwitch])

    return (
        <div className="nodeGroup">
            {
                Nodes.map((x, i, arr) => {
                    return (
                        <>
                            <Node index={props.index * 30 + i} />
                            {
                                i < arr.length - 1 ? 
                                <Switcher
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

const Node = (props: any) => {
    const [cue, setCue] = useState<Cue>();
    const [active, setActive] = useState(false);

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
                console.log(cue);

            }
            setCurrCue(null)
        }
    }, [currCue])

    return (
        <div
            className={`${active ? 'active' : 'idle'} node`}
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
                            <p>0:22</p>
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

const Switcher = (props: any) => {

    return (
        <button onClick={()=>props.setTriggerSwitch(true)}>SWITCH</button>
    )
}

const Selector = (props: any) => {

    const project: Project = props.project;
    const { selectionActive, setSelectionActive, setCurrCue } = useContext(SelectionContext);

    return (
        <ul id="selector">
            <button onClick={()=>setSelectionActive(false)}>X</button>
            {
                project.cueList.map((x, i) => {
                    return (
                        <li
                            key={i}>
                            <button
                                onClick={(ev) => {
                                    setCurrCue(x)
                                    setSelectionActive(false)
                                }}
                            >
                                {x.name}
                            </button>
                        </li>
                    )
                })
            }
        </ul>
    )
}