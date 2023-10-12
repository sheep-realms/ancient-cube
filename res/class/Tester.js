class Tester {
    constructor(world, player) {
        this.world = world;
        this.player = player;
    }

    mapClear() {
        let size = this.world.getSelectedRoom().getSelectedStage().size;
        for (let i = 0; i < size.height; i++) {
            for (let j = 0; j < size.width; j++) {
                this.player.goto(i, j);
            }
        }
    }

    nextMapClear() {
        this.player.switchStage(this.world.getSelectedRoom().stage.length);
        this.mapClear();
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