import { Layer, db } from "@/electron/DB";
import { ipcRenderer } from "electron";
import React, { useState, useEffect } from "react";
import useResizeObserver from 'use-resize-observer';
import { PropertiesWindow } from "./PropertiesWindow";

export const Track = (props: any) => {

  const params = props.params;
  const layer: Layer = props.layer;
  const ind = props.ind;
  const scale = props.scale;

  const [fadeInActive, setFadeInActive] = useState(layer.fadeIN_Active);
  const [fadeOutActive, setFadeOutActive] = useState(layer.fadeOUT_Active);

  const [fadeInLength, setFadeInLength] = useState(layer.fadeIN);
  const [fadeOutLength, setFadeOutLength] = useState(layer.fadeOUT);
  const [start, setStart] = useState(layer.start);
  const [length, setLength] = useState(layer.duration);

  const [propertiesActive, setPropertiesActive] = useState(false);

  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width, height }) => {
      if (width) {
        layer.duration = width * (1 / scale);
        setLength(layer.duration);
        db.save();
      }
    }
  });

  const evListenerFADEIN = (ev: any) => {
    ev.target.requestPointerLock();
    console.log(ev.clientX, ev);
    layer.fadeIN += ev.movementX * (1 / scale);
    console.log(layer);
    setFadeInLength(layer.fadeIN);
  }

  const evListenerFADEOUT = (ev: any) => {
    ev.target.requestPointerLock();
    layer.fadeOUT += ev.movementX * -1 * (1 / scale);
    console.log(ev.clientX, ev);
    setFadeOutLength(layer.fadeOUT);
  }

  const evListenerMOVE = (ev: any) => {
    ev.target.requestPointerLock();
    layer.start += ev.movementX * (1 / scale);
    setStart(layer.start)
    console.log('start is: ', layer.start);
  }

  useEffect(() => {
    /* I dont know why i did that, but i am scared to delete it */
  }, [fadeInActive, fadeOutActive])

  return (
    <div
      className="cueLayer"
      key={`${params.project}_${params.cue}_${layer.name}_${ind}`}
    >
      <div
        className="cueContent"
        ref={ref}
        style={
          {
            marginLeft: start * scale,
            width: (length * scale) + 4,
          }
        }
      >
        <div className="fade fadeIn" style={{ width: fadeInLength * scale }}>
          <div className="fadeContent">
            <div
              className={`fadeInAnchor${fadeInActive ? ' ' : ' disabled'}${fadeInLength == 0 ? ' init' : ''}`}
              onDoubleClick={(ev) => {
                setFadeInActive(!fadeInActive);
                layer.fadeIN_Active = !layer.fadeIN_Active;
                if (fadeInActive === false && fadeInLength < 200) {
                  setFadeInLength(200);
                }
                db.save();
              }}
              onMouseDown={(ev) => {
                if (fadeInActive) {
                  ev.target.addEventListener('mousemove', evListenerFADEIN);
                  ev.target.addEventListener('mouseup', (ev) => {
                    db.save();
                    ev.target?.removeEventListener('mousemove', evListenerFADEIN);
                    document.exitPointerLock();
                  }, { once: true })
                }
              }}
            >
            </div>
          </div>
        </div>
        <p
          onMouseDown={(ev) => {
            ev.target.addEventListener('mousemove', evListenerMOVE);
            ev.target.addEventListener('mouseup', (ev) => {
              db.save();
              ev.target?.removeEventListener('mousemove', evListenerMOVE);
              document.exitPointerLock();
            }, { once: true })
          }}
          onDoubleClick={(ev) => {
            //ipcRenderer.send('open-layerProperties', `${params.project}+${params.cue}+${layer.name}`)
            setPropertiesActive(true);
          }}
        >{layer.name}</p>
        {
          propertiesActive ? 
          <PropertiesWindow
            project={params.project}
            cue={params.cue}
            layer={layer}
          />
            : <></>
        }
        <div className="fade fadeOut" style={{ width: fadeOutLength * scale }}>
          <div className="fadeContent">
            <div
              className={`fadeOutAnchor${fadeOutActive ? ' ' : ' disabled'}${fadeOutLength == 0 ? ' init' : ' '}`}
              onDoubleClick={(ev) => {
                setFadeOutActive(!fadeOutActive);
                layer.fadeOUT_Active = !layer.fadeOUT_Active;
                if (fadeOutActive === false && fadeOutLength < 200) {
                  setFadeOutLength(200);
                }
                db.save();
              }}
              onMouseDown={(ev) => {
                if (fadeOutActive) {
                  ev.target.addEventListener('mousemove', evListenerFADEOUT);
                  ev.target.addEventListener('mouseup', (ev) => {
                    db.save();
                    ev.target?.removeEventListener('mousemove', evListenerFADEOUT);
                    document.exitPointerLock();
                  }, { once: true })
                }
              }}
            >
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}