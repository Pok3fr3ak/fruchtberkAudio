import { db, Layer } from "../electron/DB";
import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import useResizeObserver from "use-resize-observer";
import { audioManager } from "./AudioManager";
import { Mixer } from "./Mixer";
import { TimeStamp } from "./Timestamp";
import { Track } from "./Track";
import { Application, BackButton, Content, Header, MenuColumn, Overlay, ToolColumn } from './components';

const CueEditor = (props: any) => {

  const params = props.match.params;
  const cue = db.getCue(params.project, params.cue)
  const layers = cue.files;

  const [mixerActive, setMixerActive] = useState(true);
  const [editingDesecription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState(cue.description);
  const [scale, setScale] = useState(cue.getZoomScale());

  const scaleFactors: Array<number> = [
    1, 0.5, 0.25, 0.1, 0.05, 0.025, 0.01, 0.005, 0.0025, 0.001
  ];

  const [cueLength, setCueLength] = useState(0);

  const { ref, } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width, height }) => {
      if (width) {
        console.log(width, (width * (1 / scaleFactors[scale])) / 1000);
        setCueLength(Math.floor((width * (1 / scaleFactors[scale])) / 1000));
        console.log(cueLength);
      }
    }
  });

  const timeArray: Array<any> = new Array(cueLength);

  const middleMouseMove = (ev: any) => {
    ev.target.scrollLeft += ev.movementX;
    ev.target.scrollTop += ev.movementY;
    //console.log(ev.target.scrollLeft,ev.movementX, ev);
  }

  useEffect(() => {
    ipcRenderer.on('file-chosen', (ev, data: Array<string>) => {
      data.forEach(x => {
        console.log(cue.getCue(), cue.addFile);

        cue.addFile(new Layer(x));
        db.save();
        window.location.reload();
      })
    });

    return () => {
      ipcRenderer.removeAllListeners('file-chosen')
    };
  }, [])

  useEffect(() => {
    cue.setZoomScale(scale)
  }, [scale])

  return (
    <>
      <MenuColumn>
        <BackButton link={`/project/${params.project}`} />
      </MenuColumn>
      <Application>
        <Header>
          <h1>{params.cue}</h1>
          <div>
            <button
              onClick={() => {
                audioManager.addCueToPlayer(cue, cue.id);
                audioManager.playCue(cue.id);
              }}
            >TestPlay</button>
            <button onClick={() => {
              setEditingDescription(true);
            }}>
              Edit Description
            </button>
            <button
              onClick={() => setMixerActive(!mixerActive)}
              style={mixerActive ? { background: 'var(--text-color)' } : {}}
            >
              Mixer
            </button>
          </div>
        </Header>
        <Content>
          <article className="editor panel">
            <header className="flex row flex-end">
              <button onClick={() => {
                if (scale - 1 >= 0) {
                  setScale(scale - 1);
                }
              }}>+</button>
              <button onClick={() => {
                if (scale + 1 < scaleFactors.length) {
                  setScale(scale + 1);
                }
              }}>-</button>
              <button
                onClick={() => {
                  ipcRenderer.send('prompt-choose-file')
                }}
              >Add</button>
            </header>
            <main
              className="cueTimeline"
              ref={ref}
              onMouseDown={(ev: any) => {
                if (ev.button === 1) {
                  const target = ev.nativeEvent.path.find((x: any) => x.nodeName === "MAIN")
                  ev.preventDefault();
                  target.requestPointerLock();
                  target.addEventListener('mousemove', middleMouseMove)
                  target.addEventListener('mouseup', (ev: any) => {
                    target.removeEventListener('mousemove', middleMouseMove);
                    document.exitPointerLock();
                  })
                }
              }}
            >
              <div className="time">
                {
                  timeArray.map((x, i) => {
                    return <TimeStamp
                      scale={scaleFactors[scale]}
                      index={i}
                    />
                  })

                }
              </div>
              {
                layers.map((layer, ind) => {
                  return (
                    <Track
                      key={ind + `${Math.floor(Math.random() * 1000)}`}
                      params={params}
                      layer={layer}
                      ind={ind}
                      scale={scaleFactors[scale]}
                    />
                  )
                })
              }
            </main>
          </article>
          {
            mixerActive ?
              <article className="mixer panel">
                <header></header>
                <main className="flex row">
                  {
                    layers.map((layer, ind) => {
                      return (
                        <Mixer
                          key={`mix_${ind}-${Math.floor(Math.random() * 1000)}`}
                          params={params}
                          layer={layer}
                          ind={ind}
                        />
                      )
                    })
                  }
                </main>
              </article>
              :
              <></>
          }

        </Content>
      </Application>
      <Overlay
        active={editingDesecription ? true : false}
      >
        <button onClick={() => setEditingDescription(false)}>X</button>
        <label htmlFor="description">Description</label>
        <textarea name="description" value={description} cols={75} rows={10} onChange={(ev) => {
          setDescription(ev.target.value); console.log(description);
        }} />
        <button onClick={() => {
          cue.setDescription(description);
          console.log(description);
          db.save();
          setEditingDescription(false);
        }}>Set Description</button>
      </Overlay>
    </>
  )
}

export { CueEditor }