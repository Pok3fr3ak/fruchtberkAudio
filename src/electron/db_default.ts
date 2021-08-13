import {  DATA } from "./DB";

export const defaultDB:DATA = {
    projects: []
}

/* const old:DATA = {
    projects: [
        {
            name: "TestProject",
            cueList: [
                {
                    name: "Elaborated Cue",
                    files: [
                        {
                            filePath: "C:\\Users\\Armin\\Google Drive\\Coding\\electron\\fruchtberkAudio\\src\\assets\\space2.wav",
                            name: "elaborated Test",
                            start: 0,
                            duration: 1000,
                            setName: function(newName: String) {
                                this.name = newName;
                            },
                            changeDuration: function(newDuration: number) {
                                this.duration = newDuration;
                            }
                        }
                    ],
                    addFile(filePath: String): void{this.files.push(new Layer(filePath));},
                    removeFile(filePath: String): void {const ind = this.files.findIndex(x => {return x.filePath === filePath;}); this.files.splice(ind, 1);
                    },
                    getFiles(): Array<Layer> {return this.files;},
                    getCue(): Cue {return this;},
                }
            ]
        }
    ]
} */