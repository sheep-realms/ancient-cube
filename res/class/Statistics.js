class Statistics {
    constructor() {
        this.data = {
            custom: {
                damage_dealt: 0,
                damage_defended: 0,
                damage_taken: 0,
                monster_kills: 0,
                move: 0
            }
        }
    }

    getStatistic(type, name) {
        return this.data[type][name];
    }

    setStatistic(type, name, value, mode = 'add') {
        switch (mode) {
            case 'add'   :  this.data[type][name] += value; break;
            case 'remove':  this.data[type][name] -= value; break;
            case 'set'   :  this.data[type][name]  = value; break;
        
            default:                                        break;
        }

        return this.data[type][name];
    }
}