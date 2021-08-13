import { defaultDB } from "./db_default";
import fs from 'fs';

export interface DATA {
    projects: Array<Project>;
    [key: string]: any;
}

export interface Phase {
    cueNumber: number;
    pan: number;
}

export class Layer {
    filePath: String;
    name: String;
    start: number;
    duration: number;
    //maxDuration: number;
    volume: number;
    pan: number;

    fadeIN: number;
    fadeIN_Active: boolean;
    
    fadeOUT: number;
    fadeOUT_Active: boolean;

    loop: boolean;

    constructor(filePath: String, name?: String, length?: number) {
        this.filePath = filePath;
        this.name = this.extractFilename(filePath) || filePath;
        this.start = 0;
        this.duration = length || 1000;
        this.volume = 100;
        this.pan = 0;
        this.fadeIN = 0;
        this.fadeIN_Active = false;

        this.fadeOUT = 0;
        this.fadeOUT_Active = false;

        this.loop = false;

        //get the duration of the File and set maxDuration

        //Methods
        this.setName = this.setName;
        this.changeDuration = this.changeDuration;
    }

    extractFilename(filepath: String) {
        return filepath.replace(/^.*[\\\/]/, '')
    }

    setName(newName: String) {
        this.name = newName;
    }

    changeDuration(newDuration: number) {
        this.duration = newDuration;
    }

    getDuration(filepath: String): number {
        return 0;
    }

}

export class Cue {
    id: number;
    name: String;
    files: Array<Layer>;
    phases: Array<Phase>;

    constructor(name: String) {
        this.name = name;
        this.files = [];
        this.phases = [];
        this.id = db.generateID();

        //Methods
        this.addFile = this.addFile;
        this.removeFile = this.removeFile;
        this.getFiles = this.getFiles;
        this.getCue = this.getCue;
    }

    addFile(newLayer: Layer): void {
        this.files.push(newLayer);
    }

    removeFile(filePath: String): void {
        const ind = this.files.findIndex(x => {
            return x.filePath === filePath;
        })

        this.files.splice(ind, 1);
    }

    getFiles(): Array<Layer> {
        return this.files;
    }

    getCue(): Cue {
        return this;
    }

}

export class Project {
    name: String;
    cueList: Array<Cue>;

    constructor(name: String) {
        this.name = name;
        this.cueList = [];

        //Methods
        this.addCue = this.addCue;
    }

    addCue(cue: Cue) {
        this.cueList.push(cue);
    }


}

class DB {
    path: any;
    data: DATA;
    default: string;
    IDs: Set<Number>;

    constructor() {
        this.default = JSON.stringify(defaultDB, customStringify);
        this.data = this.parseDB();
        this.IDs = new Set();
    }

    save() {
        console.log('DB Saved');
        localStorage.setItem('db', JSON.stringify(this.data, customStringify))
    }

    parseDB(): DATA {
        return JSON.parse(localStorage.getItem('db') || this.default, customParse);
    }

    clearDB() {
        localStorage.clear();
    }

    getCue(project: String, name: String): Cue {
        const prj = this.data.projects.find(x => {
            return x.name === project;
        })

        if (!prj) {
            throw ('Project could not be found or does not exist');
        }

        const cue = prj?.cueList.find(x => {
            return x.name === name;
        });

        if (cue) {
            return cue;
        } else {
            throw ('Cue could not be found or does not exist');
        }
    }

    getLayer(project: String, cue: String, name: String): Layer {
        const cueName = this.getCue(project, cue);

        if (!cueName) {
            throw ('Layer could not be found, because Cue could not be found or does not exist');
        }

        const layer = cueName.files.find(x => {
            return x.name === name
        })

        if (layer) {
            return layer;
        } else {
            throw ('Layer could not be found or does not exist');
        }
    }

    addProject(name: String) {
        this.data.projects.push(new Project(name));
        this.save();
    }

    getProject(project: String): Project {
        const prj = this.data.projects.find(x => {
            return x.name === project;
        })

        if (prj) {
            return prj
        } else {
            throw ('Project could not be found or does not exist')
        }
    }

    generateID():number{
        let id = Math.floor(Math.random() * 1000);

        while(this.IDs.has(id)){
            id = Math.floor(Math.random() * 1000);
        }

        return id;
    }

}

function customStringify(key: any, value: any) {
    if (typeof value === 'function') {
        return `/Function(${value.toString()})/`
    }

    return value
}

function customParse(key: any, value: any) {
    if (
        typeof value === 'string' &&
        value.startsWith('/Function(') &&
        value.endsWith(')/')
    ) {
        value = value.substring(10, value.length - 2);
        return (0, eval)(`(${value})`);
    }
    return value;
}

export const db = new DB();