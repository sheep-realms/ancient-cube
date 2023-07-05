class Item {
    constructor(id) {
        this.id = '';
        this.type = '';
        this.damage = 0;
        this.disabled = false;

        this.create(id);
    }

    create(id) {
        let obj = resource.getItem(id);
        if (obj == undefined) return;
        this.id = obj.id;
        this.type = obj.type;
        if (obj?.data != undefined) {
            if (obj.data?.attribute != undefined) {
                this.attribute = obj.data.attribute;
            }
        }
        return this;
    }
}

class Weapon extends Item {
    constructor(id) {
        super(id);
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
            ...this.attribute
        };
    }

    attack() {
        if (this.disabled) return { state: 'fail', failReason: 'item_disabled' };
        if (this.attribute.attack <= 0) return { state: 'fail', failReason: 'action_invalid' };

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
        if (this.attribute.defense <= 0) return { state: 'fail', failReason: 'action_invalid' };
        
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