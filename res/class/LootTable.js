class LootTable {
    constructor(value) {
        this.data = {
            type: 'generic',
            randomSeed: 0,
            pools: []
        };

        this.create(value);
    }

    create(value) {
        if (typeof value == 'object') {
            this.data = {...this.data, ...value};
        } else if (typeof value == 'string') {
            let d = resource.getLootTable(value);
            if (d != undefined) {
                this.data = {...this.data, ...d};
            }
        }
        
    }

    getItem() {
        let items = [];
        this.data.pools.forEach(e => {
            let b = this.conditionsTest(e?.conditions);

            if (b) {
                let item = this.weightedRandom(e.entries);
                if (this.conditionsTest(item?.conditions)) items.push(new Item(item.name));
            }
        });
        return items;
    }

    conditionsTest(value) {
        let b = true;
        try {
            if (value != undefined) {
                value.forEach(e => {
                    let p = new Predicate(e);
                    b = p.test() && b;
                });
            }
        } catch (error) {
            log.error('Loot Table Conditions Error: ' + error.name, 'class/LootTable.js > LootTable > conditionsTest()');
            return false;
        }
        return b;
    }

    weightedRandom(options) {
        var i;
    
        var weights = [];
    
        for (i = 0; i < options.length; i++) {
            options[i].weight = options[i]?.weight != undefined ? options[i].weight : 1;
            weights[i] = options[i].weight + (weights[i - 1] || 0);
        }
        
        var random = Math.random() * weights[weights.length - 1];
        
        for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
                break;
        
        return options[i];
    }
}

class Predicate {
    constructor(value) {
        this.data = {
            condition: 'empty'
        };

        this.create(value);
    }

    create(value) {
        this.data = {...this.data, ...value};
    }

    test() {
        switch (this.data.condition) {
            case 'empty':
                return true;
            
            case 'device_time_check':
                let d = new Date();
                let now = d.getTime();

                if (this.data.max > now && this.data.min < now) return true;
                return false;

            case 'random_chance':
                let r = Math.random()

                if (r < this.data.chance) return true;
                return false;

            case 'impossible':
            default:
                return false;
        }
    }
}