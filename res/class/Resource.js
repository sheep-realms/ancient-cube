class Resource {
    constructor() {
        this.data = {
            block: [],
            item: [],
            loottable: {},
            generator: {}
        };
    }

    getBlock(id) {
        return this.data.block.find((e) => {
            return e.id == id;
        });
    }

    getItem(id) {
        return this.data.item.find((e) => {
            return e.id == id;
        });
    }

    getLootTable(id) {
        return this.data.loottable[id];
    }

    getGenerator(id) {
        return this.data.generator[id];
    }
}