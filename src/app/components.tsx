import React from "react"
import { Link } from "react-router-dom"

export const BackButton = (props: any) => {
    return (
        <div className="backButtonWrapper">
            <button className="backButton">
                <Link to={props.link} className="backLink">Back</Link>
            </button>
        </div>

    )
}

export const Header = (props: any) => {
    return (
        <header id="app-header">
            {props.children}
        </header>
    )
}

export const MenuColumn = (props: any) => {
    return (
        <div id="app-menuColumn">
            {props.children}
        </div>
    )
}

export const ToolColumn = (props: any) => {
    return (
        <div id="app-toolColumn">
            {props.children}
        </div>
    )
}

export const Application = (props: any) => {
    return (
        <main id="app-main">
            {props.children}
        </main>
    )
}

export const Content = (props: any) => {
    return (
        <article id="app-content">
            {props.children}
        </article>
    )
}

export const Overlay = (props: any) => {
    const active = props.active;

    return (
        <div id="app-overlay" className={active ? 'active' : 'idle'}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div id="overlayContent">
                    {props.children}
                </div>
                <div id="overlayBG" />
            </div>

        </div>
    )
}