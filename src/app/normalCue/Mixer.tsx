import { db, Layer } from "../../electron/DB";
import React, { useEffect, useState } from "react";

const Mixer = (props: any) => {
    const params = props.params;
    const layer: Layer = props.layer;
    const ind = props.ind;

    const [mute, setMute] = useState<boolean>();
    const [solo, setSolo] = useState<boolean>();

    const [fader, setFader] = useState(layer.volume);
    const [pan, setPan] = useState(layer.pan);

    const faderListener = (ev: any) => {
        ev.target.requestPointerLock();
        layer.volume += (ev.movementY / 5) * -1;
        if (layer.volume >= 100) {
            layer.volume = 100;
        } else if (layer.volume <= 0) {
            layer.volume = 0;
        }
        setFader(Math.ceil(layer.volume * 10) / 10)
    }

    const panListener = (ev: any) => {
        ev.target.requestPointerLock();
        layer.pan += ev.movementY * -1;
        if (layer.pan <= -100) {
            layer.pan = -100;
        } else if (layer.pan >= 100) {
            layer.pan = 100;
        }
        setPan(layer.pan)
    }

    return (
        <div className="mixingElement flex row">
            <div className="fader">
                <div className="rail">
                    <div></div>
                </div>
                <div className="knob">
                    <div
                        style={
                            { height: `${100 - fader}%` }
                        }></div>
                    <div
                        onMouseDown={(ev) => {
                            ev.target.addEventListener('mousemove', faderListener);
                            ev.target.addEventListener('mouseup', (ev) => {
                                ev.target?.removeEventListener('mousemove', faderListener);
                                db.save();
                                document.exitPointerLock();
                            })
                        }}
                    ></div>
                </div>
            </div>
            <div className="controls flex col">
                <div
                    className="pan"
                    onMouseDown={(ev) => {
                        ev.target.addEventListener('mousemove', panListener);
                        ev.target.addEventListener('mouseup', (ev) => {
                            ev.target?.removeEventListener('mousemove', panListener);
                            db.save();
                            document.exitPointerLock();
                        })
                    }}
                    style={{ transform: `rotateZ(${pan}deg)` }}
                >
                    <div className="tip"></div>
                </div>
                <div className="buttons flex col">
                    <div className="buttonContainer">
                        <button className="mute">M</button>
                    </div>
                    <div className="buttonContainer">
                        <button className="solo">S</button>
                    </div>
                </div>
                <div className="vol">
                    <p>{fader.toLocaleString()}%</p>
                </div>
            </div>
        </div>
    )
}

export { Mixer }