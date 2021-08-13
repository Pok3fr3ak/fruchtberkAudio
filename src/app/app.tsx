import { Cue, db } from '@/electron/DB';
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './main.css';
import { IpcRenderer } from 'electron';
import { CueEditor } from './CueEditor';
import { PropertiesWindow } from './PropertiesWindow';
import { Player } from './Player';
import { ProjectSelector } from './ProjectSelector';
import { Application, BackButton, Content, Header, MenuColumn, Overlay, ToolColumn } from './components';

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
        <Route exact path="/player" component={ProjectSelector} />
        <Route exact path="/player/:project" component={Player} />
      </Switch>
    </Router>
  );
}

const Home = () => {
  return (
    <div>
      <div>
        <Link to="/projectList">Edit Projects</Link>
      </div>
      <div>
        <Link to="/player">Be the DJ</Link>
      </div>
    </div>
  )
}

const ProjectList = (props: any) => {

  const prjList = db.parseDB().projects;
  const [newPrjName, setNewPrjName] = useState('');
  const [addingProject, setAddingProject] = useState(false);

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
                    className="projectCard"
                    key={`prj_${Math.floor(Math.random() * 10000)}`}
                  >
                    <Link
                      to={`/project/${x.name}`}
                      className=""
                    >
                      <h1>{x.name}</h1>
                      <p>{x.cueList.length} Cues</p>
                    </Link>
                  </div>
                )
              })
            }
          </div>
        </Content>
      </Application>
      <ToolColumn>
        <div className="newProject">
          <button onClick={() => { setAddingProject(true); }}>+</button>
        </div>
      </ToolColumn>
      <Overlay
        active={addingProject ? true : false}
      >
          <div className="wrapper">
            <button onClick={() => setAddingProject(false)}>X</button>
            <input type="text" onChange={(ev) => { setNewPrjName(ev.target.value) }} />
            <button onClick={() => {
              db.addProject(newPrjName);
              window.location.reload();
            }}>Add Project</button>
          </div>
      </Overlay>
    </>
  )
}

const ProjectOverview = (props: any) => {

  const [newCueName, setNewCueName] = useState('');
  const [addingCue, setAddingCue] = useState(false);

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
                  <div
                    className="cueCard"
                    key={`cue_${Math.floor(Math.random() * 10000)}`}
                  >
                    <Link
                      to={`/project/${props.match.params.project}/cue/${cue.name}`}
                    >
                      <h2>{cue.name}</h2>
                    </Link>
                  </div>
                )
              })
            }
          </div>
        </Content>
      </Application>
      <ToolColumn>
        <div className="newCue">
          <button onClick={() => {
            setAddingCue(true);
          }}>+</button>
        </div>
      </ToolColumn>
      <Overlay
        active={addingCue ? true : false}
      >
        <button onClick={() => {
          setAddingCue(false);
        }}>X</button>
        <input type="text" onChange={(ev) => { setNewCueName(ev.target.value) }} />
        <button onClick={() => {
          db.getProject(props.match.params.project).addCue(new Cue(newCueName));
          db.save();
          window.location.reload();
        }}>Add Cue</button>
      </Overlay>
    </>
  )
}

export default App;