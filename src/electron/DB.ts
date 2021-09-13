import { defaultDB } from "./db_default";

export interface DATA {
    projects: Array<Project>;
    [key: string]: any;
}

export interface Phase {
    cueNumber: number;
    pan: number;
}

export class Layer {
    filePath: string;
    name: string;
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

    constructor(filePath: string, name?: string, length?: number) {
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

    extractFilename(filepath: string) {
        return filepath.replace(/^.*[\\\/]/, '')
    }

    setName(newName: string) {
        this.name = newName;
    }

    changeDuration(newDuration: number) {
        this.duration = newDuration;
    }

    getDuration(filepath: string): number {
        return 0;
    }

}

export class Cue {
    id: number;
    name: string;
    description: string;
    changed: number;
    zoomScale: number;
    files: Array<Layer>;
    phases: Array<Phase>;

    constructor(name: string) {
        this.name = name;
        this.description = '';
        this.changed = Date.now();
        this.zoomScale = 5;
        this.files = [];
        this.phases = [];
        this.id = db !== undefined ? db.generateID() : 0;

        //Methods
        this.addFile = this.addFile;
        this.removeFile = this.removeFile;
        this.getFiles = this.getFiles;
        this.getCue = this.getCue;
        this.getLength = this.getLength;
        this.getZoomScale = this.getZoomScale;
        this.setZoomScale = this.setZoomScale;
        this.setDescription = this.setDescription;
    }

    addFile(newLayer: Layer): void {
        this.files.push(newLayer);
    }

    removeFile(filePath: string): void {
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

    getLength(): number {
        let longtest = 0;
        this.files.forEach(x => {
            if (x.start + x.duration > longtest) {
                longtest = x.start + x.duration
            }
        })
        return longtest
    }

    getZoomScale(): number {
        return this.zoomScale
    }

    setZoomScale(scale: number) {
        this.zoomScale = scale;
    }

    setDescription(description: string) {
        this.description = description;
    }

}

export class Project {
    name: string;
    cueList: Array<Cue>;

    constructor(name: string) {
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
    IDs: Map<string, number>;

    constructor() {
        this.default = JSON.stringify(defaultDB, customStringify);
        this.data = this.parseDB();
        this.IDs = new Map<string, number>()
    }

    save() {
        console.log('DB Saved');
        localStorage.setItem('db', JSON.stringify(this.data, customStringify))
    }

    parseDB(): DATA {
        console.time()
        let checkProject = new Project('test');
        let checkCue = new Cue('test');
        let checkLayer = new Layer('test');

        let retrievedData: DATA = JSON.parse(localStorage.getItem('db') || this.default, customParse);
        retrievedData.projects = retrievedData.projects.map((x) => {
            x.cueList = x.cueList.map(x => {
                x.files = x.files.map(x => {
                    return this.checkContent(x, checkLayer, 'layer')
                })
                return this.checkContent(x, checkCue, 'cue')
            })
            return this.checkContent(x, checkProject, 'project')
        })
        return retrievedData
    }

    checkContent(obj: Object, data: Object, hirarchy?: string): any {
        Object.getOwnPropertyNames(data).forEach((prop) => {
            if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
                obj = Object.assign(data, {
                    //@ts-ignore
                    [prop]: data[prop]
                })
                console.log(`!!!!Added property ${prop}!!!!`);

            } else {
                //console.log(`Property: ${prop} exists on object (${hirarchy})`);
            }
        })

        return obj
    }


    clearDB() {
        localStorage.clear();
    }

    getCue(project: string, name: string): Cue {
        const prj = this.data.projects.find(x => {
            return x.name === project;
        })

        if (prj === undefined) throw ('Project could not be found or does not exist');

        const cue = prj?.cueList.find(x => x.name === name);

        if (cue) {
            return cue;
        } else {
            throw ('Cue could not be found or does not exist');
        }
    }

    getLayer(project: string, cue: string, name: string): Layer {
        console.log(project, cue, name);

        const cueName = this.getCue(project, cue);

        if (!cueName) throw ('Layer could not be found, because Cue could not be found or does not exist');

        const layer = cueName.files.find(x => x.name === name)

        if (layer) {
            return layer;
        } else {
            throw ('Layer could not be found or does not exist');
        }
    }

    addProject(name: string) {
        this.data.projects.push(new Project(name));
        this.save();
    }

    getProject(project: string): Project {
        const prj = this.data.projects.find(x => {
            return x.name === project;
        })

        if (prj) {
            return prj
        } else {
            throw ('Project could not be found or does not exist')
        }
    }

    addID(key: string) {
        let id = this.generateID()
        this.IDs.set(key, id);

        console.log(this.IDs);

        return id
    }

    getID(key: string) {
        return this.IDs.get(key);
    }

    generateID(): number {
        let id = Math.floor(Math.random() * 1000);

        let done = this.checkID(id);

        while (done === false) {
            id = Math.floor(Math.random() * 1000);
            done = this.checkID(id);
        }

        return id;
    }

    checkID(id: number): boolean {
        let status = true;
        this.IDs.forEach((v, k) => {
            if (v === id) status = false;
        })

        return status
    }

    parseUrl(string: string): string {
        return decodeURI(string);
    }

    getData(){
        return this.data
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

const db = new DB();

export {db, customParse, customStringify}