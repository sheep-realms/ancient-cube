class Resource {
    constructor() {
        this.data = {
            blocks: [],
            items: [],
            loottable: {},
            generator: {}
        };
    }

    getBlock(id) {
        return this.data.blocks.find((e) => {
            return e.id == id;
        });
    }

    getItem(id) {
        return this.data.items.find((e) => {
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