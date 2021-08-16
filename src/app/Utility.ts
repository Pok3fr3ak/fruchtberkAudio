export class Utility{
    public IDs: Set<Number>

    constructor(){
        this.IDs = new Set();
    }

    getNewID(){
        let id = Math.floor(Math.random() * 100000);

        while(this.IDs.has(id)){
            id = Math.floor(Math.random() * 100000);
        }

        this.IDs.add(id);

        return id
    }

    static eventListenerMouseMove(ev:any, listener:any, pointerLock = true){
        
    }
}



export const UtilityManager = new Utility();