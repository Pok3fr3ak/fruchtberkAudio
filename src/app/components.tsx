import React from "react"
import { Link } from "react-router-dom"

export const BackButton = (props: any) => {
    return (
        <button className="backButton">
            <Link to={props.link} className="backLink">Back</Link>
        </button>
    )
}