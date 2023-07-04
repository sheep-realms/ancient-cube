class Item {
    constructor(id, type) {
        this.id = id;
        this.type = type;
        this.damage = 0;
        this.disabled = false;
    }
}

class Weapon extends Item {
    constructor(id) {
        super(id, 'weapon');
        this.attribute = {
            attack: 0,
            defense: 0,
            attack_cost: 0,
            defense_cost: 0,
            distance: 0,
            health: 0,
            cd: 0,
            ballistic_type: 'close_combat',
            damage_type: 'sharp',
        };
    }

    attack() {
        if (this.disabled) return { state: 'fail', failReason: 'item_disabled' };

        if (++this.damage >= this.attribute.health) this.disabled = true;

        return {
            state: 'success',
            data: {
                attack: this.attribute.attack,
                damageType: this.attribute.damage_type,
                cost: this.attribute.attack_cost,
                health: {
                    damage: this.damage,
                    max: this.attribute.health
                },
                disabled: this.disabled
            }
        };
    }

    defense(damageValue) {
        if (this.disabled) return { state: 'fail', failReason: 'item_disabled' };
        
        if (++this.damage >= this.attribute.health) this.disabled = true;

        let dv = damageValue - this.attribute.defense;
        if (dv < 0) dv = 0;

        return {
            state: 'success',
            data: {
                defense: this.attribute.defense,
                undefendedDamage: dv,
                cost: this.attribute.defense_cost,
                health: {
                    damage: this.damage,
                    max: this.attribute.health
                },
                disabled: this.disabled
            }
        }
    }
}