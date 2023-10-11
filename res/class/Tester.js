class Tester {
    constructor(world, player) {
        this.world = world;
        this.player = player;
    }

    mapClear() {
        let size = this.world.getSelectedRoom().getSelectedStage().size;
        for (let i = 0; i < size.height; i++) {
            for (let j = 0; j < size.width; j++) {
                p.goto(i, j);
            }
        }
    }

    nextMapClear() {
        this.player.switchStage(this.world.getSelectedRoom().stage.length);
        this.mapClear();
    }
}