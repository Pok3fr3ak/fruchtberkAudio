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
                                <Pair
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

const Pair = (props: any) => {

    const [leftCue, setLeftCue] = useState<Cue>();
    const [rightCue, setRightCue] = useState<Cue>();

    const [leftActive, setLeftActive] = useState(false);
    const [rightActive, setRightActive] = useState(false);

    const { selectionActive, setSelectionActive, selected, setSelected } = useContext(SelectionContext);

    const selector = (ID: number) => {
        //setSelected(ID);
        console.log(selected);
    }

    const setActive = (left = true) => {
        if (left === true) {
            setRightActive(false);
            setLeftActive(!leftActive);
        } else {
            setLeftActive(false);
            setRightActive(!rightActive);
        }
    }

    useEffect(() => {
        console.log(selectionActive);
        if (leftActive === true || rightActive === true) {
            setSelectionActive(true);
        } else {
            setSelectionActive(false);
        }
    }, [leftActive, rightActive])

    return (
        <div>
            <div
                className={`leftCue ${leftActive ? 'active' : 'idle'} test`}
                onClick={() => {
                    /* selector(lID) */
                    setActive();
                }}
            ></div>
            <div
                className={`rightCue ${rightActive ? 'active' : 'idle'} test`}
                onClick={() => {
                    /* selector(rID) */
                    setActive(false);
                }}
            ></div>
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

/* ${selected === lID ? 'active' : 'idle'} */

/* ${selected === rID ? 'active' : 'idle'} */