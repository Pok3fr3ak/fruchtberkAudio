import React, { useState, useContext, useEffect } from "react";
import { db, Cue, SpotifyCue } from "../../electron/DB";
import { audioManager } from "../AudioManager";
import { NodeProps } from "../customInterfaces";
import { MdClear, MdPause, MdPlayArrow } from "react-icons/md";
import { CustomButton } from "../components";
import { SelectionContext } from "../Player";

const Node = (props: NodeProps) => {
    const selectedCues = props.selectedCues;
    const setSelectedCues = props.setSelectedCues;

    const id: number = db.getID(`node-${props.index}`) || db.addID(`node-${props.index}`)

    const [cue, setCue] = useState<Cue>();
    const [spotifyCue, setSpotifyCue] = useState<SpotifyCue>();
    const [active, setActive] = useState(false);
    const [time, setTime] = useState(0);

    const { selectionActive, setSelectionActive, selected, setSelected, currCue, setCurrCue, currSpotifyCue, setCurrSpotifyCue } = useContext(SelectionContext);

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
            } else if (currSpotifyCue !== null && currSpotifyCue !== undefined) {
                setSpotifyCue(currSpotifyCue)

            }
            setCurrCue(null)
        }
    }, [currCue, currSpotifyCue])

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
                cue || spotifyCue ?
                    <>
                        <div className="flex row space-between header">
                            <h2>{cue ? cue.name : spotifyCue.name}</h2>

                            <CustomButton
                                class="clearCue row"
                                size="2em"
                            >
                                <MdClear />
                            </CustomButton>
                        </div>

                        <p className="description">{cue ? cue.description : ''}</p>

                        <div className="footer">
                            <CustomButton
                                iconColor="white"
                                size="2em"
                                class="minor"
                                onClick={() => {
                                    if (props.currPlaying === props.localIndex) {
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
                            {
                                cue ? <>
                                    <div className="time">
                                        <p>{props.currPlaying === props.localIndex ? time : cue.getLength()}</p>
                                        <p className="indicator"> </p>
                                    </div>
                                </>
                                    :
                                    <>
                                    </>
                            }

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

export { Node }