class Tester {
    constructor(world, player) {
        this.world = world;
        this.player = player;
    }

    mapClear(autoSlot = false) {
        let stage = this.world.getSelectedRoom().getSelectedStage()
        let size = stage.size;
        for (let i = 0; i < size.height; i++) {
            for (let j = 0; j < size.width; j++) {
                if (autoSlot) {
                    if (stage.map[i][j].type == 'monster') {
                        p.selectSlot(1);
                    } else {
                        p.selectSlot(0);
                    }
                }
                this.player.goto(i, j);
            }
        }
    }

    nextMapClear(autoSlot = false) {
        this.player.switchStage(this.world.getSelectedRoom().stage.length);
        this.mapClear(autoSlot);
    }

    giveMeAllWeapon() {
        this.player.giveItems([
            new Weapon('sword'),
            new Weapon('dagger'),
            new Weapon('knife'),
            new Weapon('spear'),
            new Weapon('kunai'),
            new Weapon('broadsword'),
            new Weapon('hammer'),
            new Weapon('crowbar'),
            new Weapon('rapier'),
            new Weapon('teach_weapon')
        ]);
    }
}