import { Cue } from "@/electron/DB"
import React from "react"
import { Link } from "react-router-dom"

const BackButton = (props: any) => {
    return (
        <div className="backButtonWrapper">
            <button className="backButton">
                <Link to={props.link} className="backLink">Back</Link>
            </button>
        </div>

    )
}

interface CueCardProps {
    cue: Cue,
    optionalClass?: string
    link?: boolean
    linkto?: string,
}

const CueCard = (props: CueCardProps) => {
    const date = new Date(props.cue.changed)

    const cardContent = () => {
        return (
            <>
                <h2>{props.cue.name}</h2>
                <p className="cueDescription">{props.cue.description}</p>
                <p className="info">{`Last Changed: ${date.toLocaleDateString('de-DE')}, ${date.toLocaleTimeString('de-DE')}`}</p>
            </>
        )
    }

    return (
        <div
            className={`cueCard ${props.optionalClass ? props.optionalClass : ''}`}
            key={`cue_${Math.floor(Math.random() * 10000)}`}
        >
            {
                props.link ? <Link to={props.linkto}>
                    {cardContent()}
                </Link>
                    :
                <div className="no-link">
                    {cardContent()}
                </div>
            }

        </div>
    )
}

const Header = (props: any) => {
    return (
        <header id="app-header">
            {props.children}
        </header>
    )
}

const MenuColumn = (props: any) => {
    return (
        <div id="app-menuColumn">
            {props.children}
        </div>
    )
}

const ToolColumn = (props: any) => {
    return (
        <div id="app-toolColumn">
            {props.children}
        </div>
    )
}

const Application = (props: any) => {
    return (
        <main id="app-main">
            {props.children}
        </main>
    )
}

const Content = (props: any) => {
    return (
        <article id="app-content">
            {props.children}
        </article>
    )
}

const Overlay = (props: any) => {
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

export { BackButton, CueCard, Header, MenuColumn, ToolColumn, Application, Content, Overlay }