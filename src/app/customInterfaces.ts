import { Cue, Layer, SpotifyCue } from "../electron/DB";
import { FilePlayer } from "./AudioManager/FilePlayer";

interface BackButtonProps {
    link: string,
    additional?: (...args: any[]) => any
    [key: string]: any
}

interface Cache {
    id: number,
    layer: Layer
}

interface CueCardProps {
    cue?: Cue,
    spotifyCue?: SpotifyCue
    optionalClass?: string
    link?: boolean
    linkto?: string,
}

interface CustomButtonProps {
    class?: string
    iconColor?: string
    size?: string
    onClick?: (...args: any[]) => any
    [key: string]: any
}

interface DeleteButtonToggleProps {
    deleteMode: boolean,
    setDeleteMode: (arg: boolean) => void
    [key: string]: any
}

interface DeleteButtonProps {
    deleteFunction: (arg: any) => any
    [key: string]: any
}

interface DOMCache {
    id: number,
    layer: Layer,
    player: FilePlayer
}

type FadeDirection = 'in' | 'out'

interface GroupProps {
    index: number,
    playing: boolean,
}

interface NodeProps {
    index: number,
    localIndex: number,
    currPlaying: number | null,
    setCurrPlaying: (arg: number | null) => void
    selectedCues: Array<SelectedCues | null>,
    setSelectedCues: (selCue: Array<SelectedCues | null>) => void
}

interface PlaylistData {
    collaborative: boolean,
    description: string,
    external_urls: any
    href: string,
    id: string,
    images: Array<{
        height: number,
        url: string,
        width: number
    }>,
    name: string,
    owner: {
        display_name: string,
        external_urls: any,
        href: string,
        id: string,
        type: string,
        uri: string
    }
    primaryColor: any,
    public: boolean,
    snapshot_id: string,
    tracks: {
        href: string,
        total: number
    },
    type: string,
    uri: string
}

interface SelectedCues {
    cue?: Cue,
    spotifyCue?: SpotifyCue,
    id: number
}

interface SelectionContextInterface {
    selectionActive: boolean,
    setSelectionActive: (selection: boolean) => void,
    selected: number,
    setSelected: (num: number) => void,
    currCue: Cue | null,
    setCurrCue: (cue: Cue | null) => void,
    currSpotifyCue: SpotifyCue | null,
    setCurrSpotifyCue: (spotifyCue: SpotifyCue | null) => void
}

interface SpotifyData {
    href: string,
    items: Array<PlaylistData>,
    limit: number,
    next: any,
    offset: number,
    previous: any,
    total: number
}

interface SpotifyPlaybackProps {
    token: string,
    spotifyLayer: SpotifyCue
    [key: string]: any
}

interface SwitcherProps {
    direction: string,
    index: number,
    triggerSwitch: TriggerInfo,
    active: boolean
    setTriggerSwitch: (obj: any) => void
}

interface TriggerInfo {
    trigger: boolean
    lastPlaying: number | null,
    toPlay: number,
}

export { BackButtonProps, CueCardProps, CustomButtonProps, DeleteButtonToggleProps, DeleteButtonProps, SpotifyPlaybackProps, SpotifyData, PlaylistData, TriggerInfo, SelectionContextInterface, GroupProps, SelectedCues, NodeProps, SwitcherProps, Cache, DOMCache, FadeDirection }