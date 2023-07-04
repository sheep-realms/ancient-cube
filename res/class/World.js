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
    }

    create() {
        this.room[0] = new Room();
    }

    search(room, stage, y, x) {
        return this.room[room].search(stage, y, x);
    }

    goto(room, stage, y, x) {
        return this.room[room].goto(stage, y, x);
    }

    setBlock(room, stage, y, x, id, data = undefined) {
        return this.room[room].setBlock(stage, y, x, id, data);
    }

    getSelectedRoom() {
        return this.room[this.selectedRoom];
    }
}