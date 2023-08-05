class Debuger {
    constructor() {
        this.__master         = true;
        this.__item           = {
            no_damage:          false
        };
        this.__player         = {
            dead_action:        true,
            no_damage:          false
        };

        this.boundEvent  = {
            debugMessageOutput: function() {}
        };
    }

    bind(event, action = function() {}) {
        return this.boundEvent[event] = action;
    }

    debugOutput(name, value) {
        this.boundEvent.debugMessageOutput({
            name: name,
            value: value
        });
    }

    get master() {
        return this.__master;
    }

    set master(value) {
        if (typeof value !== 'boolean' || value === this.__master) return;
        this.debugOutput('master', value);
        return this.__master = value;
    }

    get player_dead_action() {
        return this.__master && this.__player.dead_action;
    }

    set player_dead_action(value) {
        if (typeof value !== 'boolean' || value === this.player_dead_action) return;
        this.debugOutput('player_dead_action', value);
        return this.__player.dead_action = value;
    }

    get player_no_damage() {
        return this.__master && this.__player.no_damage;
    }

    set player_no_damage(value) {
        if (typeof value !== 'boolean' || value === this.player_no_damage) return;
        this.debugOutput('player_no_damage', value);
        return this.__player.no_damage = value;
    }

    get item_no_damage() {
        return this.__master && this.__item.no_damage;
    }

    set item_no_damage(value) {
        if (typeof value !== 'boolean' || value === this.item_no_damage) return;
        this.debugOutput('item_no_damage', value);
        return this.__item.no_damage = value;
    }
}