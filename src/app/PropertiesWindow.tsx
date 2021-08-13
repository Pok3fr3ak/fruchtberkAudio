import { db, Layer } from "@/electron/DB";
import React, { useState } from "react"

export const PropertiesWindow = (props: any) => {

    const prj = props.project;
    const cue = props.cue;
    const lyr: Layer = props.layer;
    const setPropertiesActive = props.setPropertiesActive;

    const layer = db.getLayer(prj, cue, lyr.name);

    const [start, setStart] = useState(layer.start);
    const [duration, setDuraton] = useState(layer.duration);
    const [fadeInActive, setFadeInActive] = useState(layer.fadeIN_Active);
    const [fadeOutActive, setFadeOutActive] = useState(layer.fadeOUT_Active);
    const [fadeInLength, setFadeInLength] = useState(layer.fadeIN);
    const [fadeOutLength, setFadeOutLength] = useState(layer.fadeOUT);
    const [pan, setPan] = useState(layer.pan);
    const [volume, setVolume] = useState(layer.volume);
    const [loop, setLoop] = useState(layer.loop);

    function changeListener(value: any, setter: any) {
        console.log('Something"s changing...-..-', value);

        setter(value);
    }

    return (
        <div className="propertyWindow">
            <div className="property">
                <button id="close" onClick={() => setPropertiesActive(false)}>Back</button>
            </div>
            <div className="property">
                <p className="type">Start</p>
                <div className="value">
                    <input
                        type="text"
                        onChange={(ev) => {
                            changeListener(ev.target.value, setStart)
                        }}
                        value={start} />
                    <p>ms</p>
                </div>
            </div>
            <div className="property">
                <p className="type">Duration</p>
                <div className="value">
                    <input
                        type="text"
                        onChange={(ev) => {
                            changeListener(ev.target.value, setDuraton)
                        }}
                        value={duration} />
                    <p>ms</p>
                </div>
            </div>
            <div className="property">
                <p className="type">Fade In State</p>
                <div className="value">
                    <input
                        type="text"
                        onChange={(ev) => {
                            changeListener(ev.target.value, setFadeInActive)
                        }}
                        value={`${fadeInActive}`} />
                    <p></p>
                </div>
            </div>
            <div className="property">
                <p className="type">Fade Out State</p>
                <div className="value">
                    <input
                        type="text"
                        onChange={(ev) => {
                            changeListener(ev.target.value, setFadeOutActive)
                        }}
                        value={`${fadeOutActive}`} />
                    <p></p>
                </div>
            </div>
            <div className="property">
                <p className="type">Fade In Length</p>
                <div className="value">
                    <input
                        type="text"
                        onChange={(ev) => {
                            changeListener(ev.target.value, setFadeInLength)
                        }}
                        value={fadeInLength} />
                    <p>ms</p>
                </div>
            </div>
            <div className="property">
                <p className="type">Fade Out Length</p>
                <div className="value">
                    <input
                        type="text"
                        onChange={(ev) => {
                            changeListener(ev.target.value, setFadeOutLength)
                        }}
                        value={fadeOutLength} />
                    <p>ms</p>
                </div>
            </div>
            <div className="property">
                <p className="type">Pan</p>
                <div className="value">
                    <input
                        type="text"
                        onChange={(ev) => {
                            changeListener(ev.target.value, setPan)
                        }}
                        value={pan} />
                    <p>%</p>
                </div>
            </div>
            <div className="property">
                <p className="type">Volume</p>
                <div className="value">
                    <input
                        type="text"
                        onChange={(ev) => {
                            changeListener(ev.target.value, setVolume)
                        }}
                        value={volume} />
                    <p>%</p>
                </div>
            </div>
            <div className="property">
                <p className="type">Loop</p>
                <div className="value">
                    <input
                        type="text"
                        onChange={(ev) => {
                            changeListener(ev.target.value, setLoop)
                        }}
                        value={`${loop}`} />
                    <p></p>
                </div>
            </div>
            <button
                className="confirmButton"
                onClick={() => {

                }}>Confirm Changes</button>
        </div>
    )
}