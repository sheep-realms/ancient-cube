class Player {
    constructor(world) {
        this.health       = 6;
        this.healthMax    = 6;
        this.attribute    = [];
        this.lastPos      = [0, 0];
        this.inventory    = [];
        this.hotbar       = [];
        this.selectedSlot = 0;
        this.world        = {};

        this.boundEvent   = {
            goto:               function() {},
            healthDamage:       function() {},
            healthRegeneration: function() {},
            dead:               function() {},
            updateAttribute:    function() {}
        };

        this.create(world);
    }

    create(world) {
        this.world = world;
        this.attribute.push(new Attribute('health_max', 6, 'system'));
    }

    bind(event, action = function() {}) {
        return this.boundEvent[event] = action;
    }

    newAttribute(name, base = 0, from = 'system') {
        this.attribute.push(new Attribute(name, base, from));
        this.updateAttribute();
    }

    setAttribute(name, base = 0, from = 'system') {
        let a = this.attribute.find(function(e) {
            return e.name == name && e.from == from;
        });
        if (a != undefined) {
            a.base = base;
            this.updateAttribute();
            return a;
        } else {
            return;
        }
    }

    updateAttribute() {
        this.healthMax = 0;
        this.attribute.forEach(e => {
            switch (e.name) {
                case 'health_max':
                    this.healthMax += e.base;
                    break;
            
                default:
                    break;
            }
        });

        this.boundEvent.updateAttribute({
            attribute: this.attribute,
            health:    this.health,
            healthMax: this.healthMax
        });

        return {
            attribute: this.attribute,
            health:    this.health,
            healthMax: this.healthMax
        };
    }

    goto(y, x) {
        if (this.world.getSelectedRoom().getSelectedStage().map[y][x].searched) return;
        this.lastPos = [y, x];
        let r = this.world.getSelectedRoom().getSelectedStage().goto(y, x);
        this.boundEvent.goto(r);
        if (r.type == 'monster') {
            this.damage(1);
        }
        return r;
    }

    damage(value) {
        if (value       <= 0) return;
        if (this.health <= 0) return;
        let lastHealth  = this.health;
        let deathDefend = false;
        if (value == this.health && value > 1) {
            value--;
            deathDefend = true;
        }
        this.health -= Math.min(this.health, value);
        this.boundEvent.healthDamage({
            health:      this.health,
            healthMax:   this.healthMax,
            lastHealth:  lastHealth,
            damage:      Math.min(this.health, value),
            deathDefend: deathDefend
        });

        if (this.health <= 0) this.boundEvent.dead({
            lastPos: this.lastPos
        });
        return this.health;
    }

    regeneration() {

    }
}