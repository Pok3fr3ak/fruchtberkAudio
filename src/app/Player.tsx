import { Cue, db, Project } from "@/electron/DB";
import React, { useContext, useEffect, useState } from "react"
import { BackButton } from "./components";

const SelectionContext = React.createContext({
    selectionActive: false,
    setSelectionActive: (selection: boolean) => { },
    selected: 0,
    setSelected: (num: number) => { }
});

export const Player = (props: any) => {

    const project = db.getProject(`${props.match.params.project}`)
    const usedCues = new Set();

    const [numberOfPairs, setNumberOfPairs] = useState(1);

    const pairs: Array<any> = [...Array(numberOfPairs)].map((x, i) => i);

    const [selectionActive, setSelectionActive] = useState(false);
    const [selected, setSelected] = useState<number>(0);

    const selectionValue = { selectionActive, setSelectionActive, selected, setSelected };

    return (
        <div>
            <BackButton link="/player" />
            <div id="assembler">
                <SelectionContext.Provider value={selectionValue}>
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
                    <Selector
                        project={project}
                        usedCues={usedCues}
                    />
                </SelectionContext.Provider>
            </div>
        </div>
    )
}

const Group = (props: any) => {

    const { selectionActive, setSelectionActive, selected, setSelected } = useContext(SelectionContext);

    return (
        <div>
            <Node
                index={4}

            />
            <Node
                index={5}
            ></Node>
        </div>
    )
}

const Node = (props: any) => {
    const [cue, setCue] = useState<Cue>();
    const [active, setActive] = useState(false);

    const { selectionActive, setSelectionActive, selected, setSelected } = useContext(SelectionContext);

    useEffect(()=>{       
        if(selected !== props.index){
            setActive(false)
        }
    }, [selected])

    useEffect(()=>{
        if(selected === props.index && active === false){
            setSelected(0)
            setSelectionActive(false)
        }
    }, [active])

    return (
        <div
            className={`leftCue ${active ? 'active' : 'idle'} test`}
            onClick={() => {
                /* selector(lID) */
                setSelected(props.index);
                setActive(!active);
                if(selectionActive === false && active === false){
                    setSelectionActive(true)
                }
            }}>
        </div>
    )
}

const Selector = (props: any) => {

    const project: Project = props.project;
    const { selectionActive, setSelectionActive, selected, setSelected } = useContext(SelectionContext);

    return (
        <div id="selector" className={selectionActive ? 'active' : 'hidden'}>
            <ul>
                {
                    project.cueList.map((x, i) => {
                        return (
                            <li
                                key={i}>
                                <button
                                    onClick={(ev) => {

                                    }}
                                >
                                    {x.name}
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )

}