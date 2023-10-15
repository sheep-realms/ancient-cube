class Tester {
    constructor(world, player, resource) {
        this.world = world;
        this.player = player;
        this.resource = resource;
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
        let chest = new ItemChest('golden_chest');
        chest.data.chest.inventory = [
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
        ]
        this.player.give(chest);
    }

    giveMeAllItem() {
        let items = [];
        this.resource.data.item.forEach(e => {
            items.push(ItemGenerator.get(e.id))
        });
        this.player.giveItems(items);
    }

    russianDolls() {
        let golden_chest = new ItemChest('golden_chest');
        let silver_chest = new ItemChest('silver_chest');
        let copper_chest = new ItemChest('copper_chest');
        copper_chest.data.chest.inventory = [new Item('emerald')];
        silver_chest.data.chest.inventory = [copper_chest];
        golden_chest.data.chest.inventory = [silver_chest];
        this.player.give(golden_chest);
    }

    getBloodChest() {
        let chest = new ItemChest('blood_chest');
        chest.data.chest.inventory = [new Item('monster_crystal')];
        this.player.give(chest);
    }

    getParadoxChest() {
        let chest = new ItemChest('golden_chest');
        chest.data.chest.inventory = [chest];
        this.player.give(chest);
    }

    getParadoxChest2() {
        let chest = new ItemChest('emerald_chest');
        chest.data.chest.inventory = [new Item('emerald')];
        chest.data.chest.open_cost.item.id = 'emerald_chest';
        this.player.give(chest);
    }
}