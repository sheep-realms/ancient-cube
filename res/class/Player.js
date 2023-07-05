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
            updateAttribute:    function() {},
            updateHotbar:       function() {}
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

    /**
     * 玩家移动到指定位置
     * @param {Number} y Y坐标
     * @param {Number} x X坐标
     * @returns 方块数据
     */
    goto(y, x) {
        if (this.world.getSelectedRoom().getSelectedStage().map[y][x].searched) return;
        this.lastPos = [y, x];
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

    /**
     * 给予物品
     * @param {Item} item 物品
     * @returns 状态和数据
     */
    give(item) {
        if (item instanceof Item == false) return { state: 'fail', failReason: 'item_invalid' };
        let index = this.inventory.push(item);
        return {
            state: 'success',
            data: {
                item: item,
                inventoryIndex: index - 1
            }
        }
    }

    /**
     * 切换快捷栏物品
     * @param {Number} solt 快捷栏槽位
     * @param {Number} index 物品栏索引
     * @returns 状态和数据
     */
    switchHotbarItem(solt, index) {
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

    selectSlot(value) {
        this.selectedSlot = value;
        this.updateHotbar();
    }

    updateHotbar() {
        this.boundEvent.updateHotbar({
            hotbar: this.hotbar,
            selectedSlot: this.selectedSlot
        });
    }
}