import { Cue, customStringify, db, SpotifyCue } from '../electron/DB';
import React, { useState } from 'react';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './main.css';
import { IpcRenderer } from 'electron';
import { CueEditor } from './CueEditor';
import { Player } from './Player';
import { ProjectSelector } from './ProjectSelector';
import { Application, BackButton, Content, CueCard, CustomButton, DeleteButton, DeleteButtonToggle, Header, MenuColumn, Overlay, ToolColumn } from './components';
import { MdAdd, MdFileDownload, MdArrowBack, MdFileUpload, MdClear, MdStorage } from 'react-icons/md';
import { FaSpotify } from 'react-icons/fa'
import { SpotifyCueEditor } from './SpotifyCueEditor';

declare global {
  interface Window {
    require: (module: 'electron') => {
      ipcRenderer: IpcRenderer
    };
  }
}

const { ipcRenderer } = window.require('electron');

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/projectList" component={ProjectList} />
        <Route exact path="/project/:project" component={ProjectOverview} />
        <Route exact path="/project/:project/cue/:cue" component={CueEditor} />
        <Route exact path="/project/:project/spotifyCue/:spotifyCue" component={SpotifyCueEditor} />
        <Route exact path="/player" component={ProjectSelector} />
        <Route exact path="/player/:project" component={Player} />
      </Switch>
    </Router>
  );
}

const Home = () => {
  return (
    <div id="startScreen">
      <div className="mainLink">
        <Link to="/projectList">
          <figure>
            <img src="../assets/hz.jpg" alt="Der Man" />
          </figure>
          <p>Edit Projects</p>
        </Link>
      </div>
      <div className="mainLink">
        <Link to="/player">
          <figure>
            <img src="../assets/guetta.jpg" alt="Der DJ" />
          </figure>
          <p>Be the DJ</p>
        </Link>
      </div>
    </div>
  )
}

const ProjectList = (props: any) => {

  const prjList = db.parseDB().projects;
  const [newPrjName, setNewPrjName] = useState('');
  const [addingProject, setAddingProject] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  return (
    <>
      <MenuColumn>
        <BackButton link="/" />
      </MenuColumn>
      <Application>
        <Header>
          <h1>Projects</h1>
        </Header>
        <Content>
          <div className="prjList">
            {
              prjList.map((x) => {
                return (
                  <div
                    className="projectCard no-delete"
                    key={`prj_${Math.floor(Math.random() * 10000)}`}
                  >
                    <Link
                      to={`/project/${x.name}`}
                      className=""
                    >
                      <div>
                        <h1>{x.name}</h1>
                        <p>{x.cueList.length} Cues</p>
                      </div>
                      {
                        deleteMode === true ?
                          <DeleteButton
                            deleteFunction={() => { }}
                          /> : ''
                      }
                    </Link>
                  </div>
                )
              })
            }
          </div>
        </Content>

      </Application>
      <ToolColumn>
        <CustomButton
          class="newProject"
          onClick={() => { setAddingProject(true); }}
          iconColor="white"
          size="2.5em"
        >
          <MdAdd />
        </CustomButton>
        <CustomButton
          onClick={() => {
            let a = db.getData()
            ipcRenderer.send('exportDB', JSON.stringify(db.data, customStringify));
          }}
          class="saveDB"
          iconColor="white"
          size="2.5em"
        >
          <MdFileDownload />
        </CustomButton>
        <DeleteButtonToggle
          deleteMode={deleteMode}
          setDeleteMode={setDeleteMode} />
        <CustomButton
          class="importDB"
          iconColor="white"
          size="2.5em">
          <MdFileUpload />
        </CustomButton>

      </ToolColumn>
      <Overlay
        active={addingProject ? true : false}
      >
        <div className="wrapper addProject">
          <CustomButton
            onClick={() => setAddingProject(false)}
            iconColor="white"
            size="2.5em"
          >
            <MdClear />
          </CustomButton>
          <label htmlFor="prjName">Projekt Name:</label>
          <input name="prjName" type="text" onChange={(ev) => { setNewPrjName(ev.target.value) }} />
          <CustomButton
            onClick={() => {
              db.addProject(newPrjName);
              window.location.reload();
            }}
            class="text mx-auto"
          >
            Add Project
          </CustomButton>
        </div>
      </Overlay>
    </>
  )
}

const ProjectOverview = (props: any) => {

  const [newCueName, setNewCueName] = useState('');
  const [addingCue, setAddingCue] = useState(false);
  const [addSpotify, setAddSpotify] = useState<boolean | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);

  return (
    <>
      <MenuColumn>
        <BackButton link="/projectList" />
      </MenuColumn>
      <Application>
        <Header>
          <h1>{props.match.params.project}</h1>
        </Header>
        <Content>
          <div className="cueList">
            {
              db.getProject(props.match.params.project).cueList.map(cue => {

                return (
                  <CueCard
                    key={`cue-Card-${cue.id}`}
                    cue={cue}
                    link
                    linkto={`/project/${props.match.params.project}/cue/${cue.name}`} />
                )
              })
            }
            {
              db.getProject(props.match.params.project).spotifyLayers.map(spotifyCue => {
                
                return (
                  <CueCard
                    key={`cue-Card-${spotifyCue.id}`}
                    spotifyCue={spotifyCue}
                    link
                    linkto={`/project/${props.match.params.project}/spotifyCue/${spotifyCue.id}`}
                  />

                )
              })
            }
          </div>
        </Content>
      </Application>
      <ToolColumn>
        <CustomButton
          class="newCue"
          onClick={() => {
            setAddingCue(true);
          }}
        >
          <MdAdd></MdAdd>
        </CustomButton>
        <DeleteButtonToggle
          deleteMode={deleteMode}
          setDeleteMode={setDeleteMode}
        />
      </ToolColumn>
      <Overlay
        active={addingCue ? true : false}
      >
        <div className="wrapper addCue">
          <div className="flex row">
            <CustomButton
              onClick={() => {
                setAddingCue(false);
                setAddSpotify(null);
              }}
              class="row"
            >
              <MdClear />
            </CustomButton>
            {
              addSpotify !== null ?
                <CustomButton
                  onClick={() => {
                    setAddSpotify(null)
                  }}
                  class="row"
                >
                  <MdArrowBack />
                </CustomButton>
                :
                <>
                </>
            }
          </div>
          {
            addSpotify === null ?
              <>
                <div className="typeDesicion flex row">
                  <div onClick={() => {
                    setAddSpotify(false)
                  }}>
                    <figure>
                      <MdStorage />
                    </figure>
                    <p>Ganz klassische Cue</p>
                  </div>
                  <div onClick={() => {
                    setAddSpotify(true)
                  }}>
                    <figure>
                      <FaSpotify />
                    </figure>
                    <p>Spotify Cue</p>
                  </div>
                </div>
              </>
              :
              <>
              </>
          }
          {
            addSpotify === true ?
              <>
                <label htmlFor="spotifyCueName">Spotify Cue Name: </label>
                <input name="cueName" type="text" value={newCueName} onChange={(ev) => { setNewCueName(ev.target.value) }} />
                <CustomButton
                  onClick={() => {
                    db.getProject(props.match.params.project).addSpotifyCue(new SpotifyCue(newCueName))
                    db.save();
                    window.location.reload();
                  }}
                  class="text mx-auto"
                >
                  Add Spotify Cue
                </CustomButton>
              </>
              :
              <>
              </>
          }
          {
            addSpotify === false ?
              <>
                <label htmlFor="cueName">Cue Name:</label>
                <input name="cueName" type="text" onChange={(ev) => { setNewCueName(ev.target.value) }} />
                <CustomButton
                  onClick={() => {
                    db.getProject(props.match.params.project).addCue(new Cue(newCueName));
                    db.save();
                    window.location.reload();
                  }}
                  class="text mx-auto"
                >Add Cue</CustomButton>
              </>
              :
              <></>
          }
        </div>
      </Overlay>
    </>
  )
}

export default App;