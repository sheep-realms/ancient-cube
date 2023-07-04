class Room {
    constructor() {
        this.name          = 'room';
        this.stage         = [];
        this.selectedStage = 0;

        this.create();
    }

    create() {
        this.stage[0] = new Stage();
    }

    search(stage, y, x) {
        return this.stage[stage].search(y, x);
    }

    goto(stage, y, x) {
        return this.stage[stage].goto(y, x);
    }

    setBlock(stage, y, x, id, data = undefined) {
        return this.stage[stage].setBlock(y, x, id, data);
    }

    getSelectedStage() {
        return this.stage[this.selectedStage];
    }
}