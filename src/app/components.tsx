import { Cue, SpotifyCue } from "../electron/DB"
import React from "react"
import { Link } from "react-router-dom"
import { IconContext } from "react-icons"
import { MdArrowBack, MdDeleteForever, MdStorage } from "react-icons/md"
import { FaSpotify } from "react-icons/fa"
import { BackButtonProps, CueCardProps, CustomButtonProps, DeleteButtonProps, DeleteButtonToggleProps } from "./customInterfaces"

const BackButton = (props: BackButtonProps) => {
    return (
        <div className="backButtonWrapper">
            <button
                className="backButton"
                onClick={() => {
                    if (props.additional) props.additional();
                }}
            >
                <Link to={props.link} className="backLink">
                    <MdArrowBack size="2.5em" />
                </Link>
            </button>
        </div>

    )
}

const CueCard = (props: CueCardProps) => {

    const cardContent = () => {

        if (props.cue !== undefined) {

            const date = new Date(props.cue.changed)
            return (
                <>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: "space-between" }}>
                        <h2>{props.cue.name}</h2>
                        <MdStorage
                            size="2em"
                        />
                    </div>
                    <p className="cueDescription">{props.cue.description}</p>
                    <p className="info">{`Last Changed: ${date.toLocaleDateString('de-DE')}, ${date.toLocaleTimeString('de-DE')}`}</p>
                </>
            )
        }

        if (props.spotifyCue !== undefined) {
            return (
                <>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: "space-between" }}>
                        <h2>{props.spotifyCue.name}</h2>
                        <FaSpotify
                            size="2em"
                        />
                    </div>
                    <p className="info">{/* `Last Changed: ${date.toLocaleDateString('de-DE')}, ${date.toLocaleTimeString('de-DE')}` */}</p>
                </>
            )
        }
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

const CustomButton = (props: CustomButtonProps) => {
    return (
        <button
            className={`button-wrapper ${props.class ? props.class : ''} custom-button`}
            onClick={props.onClick}
        >
            <IconContext.Provider value={{ color: props.iconColor ? props.iconColor : 'white', size: props.size ? props.size : '2.5em' }}>
                {props.children}
            </IconContext.Provider>
        </button>
    )
}

const DeleteButtonToggle = (props: DeleteButtonToggleProps) => {
    return (
        <CustomButton
            class="deleteMode"
            iconColor={`${props.deleteMode === true ? 'red' : 'white'}`}
            onClick={() => {
                props.setDeleteMode(!props.deleteMode);
            }}>
            <MdDeleteForever />
        </CustomButton>
    )
}

const DeleteButton = (props: DeleteButtonProps) => {
    return (
        <CustomButton
            class="deleteMode"
            iconColor="white"
            onClick={props.deleteFunction}
        >
            <MdDeleteForever />
        </CustomButton>
    )
}

export { BackButton, CueCard, Header, MenuColumn, ToolColumn, Application, Content, Overlay, CustomButton, DeleteButtonToggle, DeleteButton }