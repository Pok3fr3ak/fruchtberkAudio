import React, { useContext } from "react";
import { Project } from "../../electron/DB";
import { CueCard } from "../components";
import { SelectionContext } from "../Player";

const Selector = (props: any) => {

    const project: Project = props.project;
    const { selectionActive, setSelectionActive, setCurrCue, setCurrSpotifyCue } = useContext(SelectionContext);

    return (
        <ul id="selector">
            <button onClick={() => setSelectionActive(false)}>X</button>
            {
                project.cueList.map((x, i) => {
                    return (
                        <li
                            key={`cue-${i}`}
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
            {
                project.spotifyLayers.map((x, i) => {
                    return (
                        <li
                            key={`spotifyCue-${i}`}
                            onClick={(ev) => {
                                setCurrSpotifyCue(x)
                                setSelectionActive(false)
                            }}
                        >
                            <CueCard
                                spotifyCue={x}
                                optionalClass="max-width-50ch"
                            />
                        </li>
                    )
                })
            }
        </ul>
    )
}

export { Selector }