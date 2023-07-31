class World {
    constructor() {
        this.name = 'world';
        this.size = {
            height: 5,
            width:  5,
            stage:  1
        };
        this.room = [];
        this.selectedRoom = 0;
        this.player = undefined;
    }

    create(generator) {
        this.room[0] = new Room(generator);
    }

    search(room, stage, y, x) {
        return this.room[room].search(stage, y, x);
    }

    goto(room, stage, y, x) {
        return this.room[room].goto(stage, y, x);
    }

    playerJoin(player) {
        this.player = player;
    }

    switchStage(stage) {
        return this.room[this.selectedRoom].switchStage(stage);
    }

    setBlock(room, stage, y, x, id, data = undefined) {
        return this.room[room].setBlock(stage, y, x, id, data);
    }

    getSelectedRoom() {
        return this.room[this.selectedRoom];
    }
}