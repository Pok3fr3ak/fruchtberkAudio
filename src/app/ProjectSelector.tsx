import { db } from "@/electron/DB"
import React from "react"
import { Link } from "react-router-dom";
import { BackButton } from "./components";

export const ProjectSelector = ()=>{
    const prjList = db.parseDB().projects;
    
    return(
        <div>
          <BackButton link="/"/>
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
                          <p>{x.cueList.length} Cues</p>
                        </Link>
                      </div>
                    )
                })
            }
        </div>
    )
}