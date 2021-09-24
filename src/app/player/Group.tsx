import React, { useState, useEffect } from "react";
import { audioManager } from "../AudioManager";
import { Node } from './Node'
import { GroupProps, TriggerInfo, SelectedCues } from "../customInterfaces";
import { Switcher } from "./Switcher";
import { MdAdd } from "react-icons/md";
import { CustomButton } from "../components";

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

export { Group }