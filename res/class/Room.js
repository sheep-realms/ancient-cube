class Room {
    constructor() {
        this.name          = 'room';
        this.stage         = [];
        this.selectedStage = 0;

        this.create();
    }

    create() {
        this.newStage();
    }

    newStage() {
        this.stage.push(new Stage());
    }

    search(stage, y, x) {
        return this.stage[stage].search(y, x);
    }

    goto(stage, y, x) {
        return this.stage[stage].goto(y, x);
    }

    switchStage(stage) {
        this.selectedStage = stage;
        if (this.stage[stage] == undefined) {
            this.stage[stage] = new Stage();
        }
    }

    setBlock(stage, y, x, id, data = undefined) {
        return this.stage[stage].setBlock(y, x, id, data);
    }

    getSelectedStage() {
        return this.stage[this.selectedStage];
    }
}