class Player {
    constructor(world) {
        this.health       = 6;
        this.healthMax    = 6;
        this.isDead       = false;
        this.attribute    = [];
        this.lastPos      = [0, 0];
        this.inventory    = [];
        this.hotbar       = [];
        this.selectedSlot = 0;
        this.discarded    = [];
        this.world        = {};

        this.boundEvent   = {
            goto:               function() {},
            healthDamage:       function() {},
            healthRegeneration: function() {},
            dead:               function() {},
            updateAttribute:    function() {},
            updateHotbar:       function() {},
            updateMap:          function() {}
        };

        this.create(world);
    }

    create(world) {
        this.world = world;
        this.attribute.push(new Attribute('health_max', 6, 'system'));
        this.health = 6;
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

    /**
     * 玩家移动到指定位置
     * @param {Number} y Y坐标
     * @param {Number} x X坐标
     * @returns 方块数据
     */
    goto(y, x) {
        if (this.isDead && !game.debug.player_dead_action) return;
        let block = this.world.getSelectedRoom().getSelectedStage().map[y][x];
        if (block.searched) {
            if (block.type != 'stair') return;
            this.switchStage(this.world.getSelectedRoom().stage.length);
            return;
        }
        this.lastPos = [y, x];
        this.clearDiscard();

        let r = this.world.getSelectedRoom().getSelectedStage().goto(y, x);
        this.boundEvent.goto(r);
        if (r.type == 'monster') {
            let killFail = false,
                defFail  = false;
            if (this.hotbar[this.selectedSlot]?.type == 'weapon') {
                // 攻击阶段
                let atk = this.hotbar[this.selectedSlot].attack();
                if (atk.state == 'success') {
                    if (atk.data.attack >= r.data.health) {
                        
                    } else {
                        killFail = true;
                    }
                } else {
                    killFail = true;
                }

                // 防御阶段
                if (killFail) {
                    let def = this.hotbar[this.selectedSlot].defense(r.data.attack);
                    if (def.state == 'success') {
                        this.damage(def.data.undefendedDamage);
                    } else {
                        defFail = true;
                    }
                }
            } else {
                defFail = true;
            }
            
            if (defFail) {
                this.damage(r?.data?.attack ? r.data.attack : 0);
            }
        } else {
            if (this.hotbar[this.selectedSlot]?.type == 'weapon') this.hotbar[this.selectedSlot].attack();
        }

        this.updateHotbar();

        return r;
    }

    damage(value) {
        if (this.isDead || game.debug.player_no_damage) return;
        if (value       >  game.config.security.damage_maximum) value = game.config.security.damage_maximum;
        if (value       <= 0) return;
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

        if (this.health <= 0) this.dead();
        
        if (this.healthMax <= 0) {
            log.error('Player Health Exception: Player.healthMax <= 0', 'class/Player.js > Player > damage()');
        }

        return this.health;
    }

    regeneration() {

    }

    /**
     * 给予物品
     * @param {Item} item 物品
     * @returns {Object} 状态和数据
     */
    give(item) {
        if (this.isDead && !game.debug.player_dead_action) return;
        if (item instanceof Item == false) return { state: 'fail', failReason: 'item_invalid' };
        let items = this.inventory.filter(function(e) {
            return e.id == item.id;
        });
        if (items.length <= 0) {
            this.inventory.push(item);
        } else {
            let joined = false;
            items.forEach(e => {
                let r = e.join(item);
                if (r != -1) {
                    joined = true;
                    return;
                }
            });
            if (!joined) {
                this.inventory.push(item);
            }
        }
        return {
            state: 'success',
            data: {
                item: item,
            }
        }
    }

    /**
     * 替换物品
     * @param {Number} index 物品栏索引
     * @param {Item} item 物品
     * @returns {Object} 状态和数据
     */
    replaceItem(index, item) {
        if (this.isDead && !game.debug.player_dead_action) return;
        if (item instanceof Item == false) return { state: 'fail', failReason: 'item_invalid' };
        this.inventory[index] = item;
        return {
            state: 'success',
            data: {
                item: item,
                inventoryIndex: index
            }
        }
    }

    /**
     * 切换快捷栏物品
     * @param {Number} solt 快捷栏槽位
     * @param {Number} index 物品栏索引
     * @returns {Object} 状态和数据
     */
    switchHotbarItem(solt, index) {
        if (this.isDead && !game.debug.player_dead_action) return;
        let item, hotbarItem;
        if (this.inventory[index] == undefined && this.hotbar[solt] == undefined) {
            return { state: 'fail', failReason: 'null' };
        } else if (this.hotbar[solt] == undefined) {
            item = this.inventory.splice(index, 1)[0];
            this.hotbar[solt] = item;
        } else if (this.inventory[index] == undefined) {
            hotbarItem = this.hotbar[solt];
            this.hotbar[solt] = undefined;
            this.inventory.push(hotbarItem);
        } else {
            item = this.inventory[index];
            hotbarItem = this.hotbar[solt];
            this.inventory[index] = hotbarItem;
            this.hotbar[solt] = item;
        }

        this.updateHotbar();

        return {
            state: 'success',
            data: {
                solt: solt,
                inventoryIndex: index
            }
        }
    }

    switchStage(stage) {
        if (this.isDead && !game.debug.player_dead_action) return;
        this.clearDiscard();
        this.world.switchStage(stage);
        this.boundEvent.updateMap(this.world.getSelectedRoom().getSelectedStage());
    }

    selectSlot(value) {
        if (this.isDead && !game.debug.player_dead_action) return;
        this.selectedSlot = value;
        this.updateHotbar();
    }

    updateHotbar() {
        this.boundEvent.updateHotbar({
            hotbar: this.hotbar,
            selectedSlot: this.selectedSlot
        });
    }
    
    discardItem(index) {
        if (this.isDead && !game.debug.player_dead_action) return;
        if (this.inventory[index] != undefined) {
            let item = this.inventory.splice(index, 1)[0];
            this.discarded.unshift(item);
        }
    }

    recoveryItem() {
        if (this.isDead && !game.debug.player_dead_action) return;
        if (this.discarded.length > 1) {
            let item = this.discarded.shift();
            this.inventory.push(item);
        }
    }

    clearDiscard() {
        if (this.isDead && !game.debug.player_dead_action) return;
        this.discarded = [];
    }

    dead() {
        this.isDead = true;
        this.boundEvent.dead({
            lastPos: this.lastPos
        });
    }
}