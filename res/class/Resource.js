class Resource {
    constructor() {
        this.data = {
            blocks: [],
            items: []
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
}