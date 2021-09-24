import { db } from "../electron/DB"
import React from "react"
import { Link } from "react-router-dom";
import { Application, BackButton, Content, Header, MenuColumn, Overlay, ToolColumn } from './components';

const ProjectSelector = () => {
  const prjList = db.parseDB().projects;

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
              prjList.map((x, i) => {
                return (
                  <div
                    className="projectCard"
                    key={`prj_${Math.floor(Math.random() * 10000)}`}
                  >
                    <Link
                      to={`/player/${x.name}`}
                      className=""
                    >
                      <h1>{x.name}</h1>
                      <p>{x.cueList.length + x.spotifyLayers.length} Cues</p>
                    </Link>
                  </div>
                )
              })
            }
          </div>
        </Content>
      </Application>
    </>
  )
}

export {ProjectSelector}