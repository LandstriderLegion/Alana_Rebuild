export default class Station {

    constructor(system, name) {
        if (!system) {
            throw Error('System name missing')
        }

        if (!name) {
            throw Error('Station name missing')
        }

        this.system = system
        this.name = name
    }
    
    toString() {
        return JSON.stringify({ system: this.system, name: this.name })
    }
}