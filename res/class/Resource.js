class Resource {
    constructor() {
        this.data = {
            blocks: []
        };
    }

    getBlock(id) {
        return this.data.blocks.find((e) => {
            return e.id == id;
        });
    }
}