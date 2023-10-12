class ItemGenerator {
    constructor() {}

    static get(id) {
        let obj = resource.getItem(id);
        if (obj == undefined) return;
        switch (obj.type) {
            case 'chest':
                return new ItemChest(id);

            case 'weapon':
                return new Weapon(id);
        
            default:
                return new Item(id);
        }
    }
}

class Item {
    constructor(id) {
        this.id       = '';
        this.type     = '';
        this.count    = 1;
        this.damage   = 0;
        this.disabled = false;
        this.data     = {};
        this.origin   = {
            player:     undefined,
            world:      undefined
        };

        this.create(id);
    }

    /**
     * 创建物品
     * @param {String} id 物品ID
     * @returns {Item} 物品
     */
    create(id) {
        let obj   = resource.getItem(id);
        if (obj == undefined) return;
        this.id   = obj.id;
        this.type = obj.type;
        if (obj?.data != undefined) {
            if (obj.data?.attribute != undefined) {
                this.attribute = obj.data.attribute;
            }
        }
        return this;
    }

    /**
     * 合并物品堆尝试
     * @param {Item} item 物品对象
     * @returns {Number} 合并后数量
     */
    join(item) {
        if (item.type != 'weapon') {
            if (
                this.id   === item.id   &&
                this.type === item.type &&
                Object.entries(this.data).toString() === Object.entries(item.data).toString()
            ) {
                this.count += item.count;
                item.setCount(0);
            }
            return this.count;
        } else {
            return -1;
        }
    }

    /**
     * 绑定关系
     * @param {Player} player 玩家
     * @param {World} world 世界
     */
    bind(player, world) {
        this.origin.player = player;
        this.origin.world  = world;
    }

    /**
     * 设置数量
     * @param {Number} value 数量
     * @returns {Number} 更新后数量
     */
    setCount(value) {
        if (this.type == 'weapon' && value > 1) return this.count;
        if (value < 0) value = 0;
        this.count = value;
        if (this.count <= 0) this.disabled = true;
        return this.count;
    }
}

class Weapon extends Item {
    constructor(id) {
        super(id);
        this.attribute = {
            attack:         0,
            defense:        0,
            attack_cost:    0,
            defense_cost:   0,
            distance:       0,
            health:         0,
            cd:             0,
            ballistic_type: 'close_combat',
            damage_type:    'sharp',
            ...this.attribute
        };
    }

    /**
     * 攻击
     * @returns {Object} 消息
     */
    attack() {
        if (this.disabled)             return { state: 'fail', failReason: 'item_disabled' };
        if (this.attribute.attack < 0) return { state: 'fail', failReason: 'action_invalid' };

        if (!game.debug.item_no_damage) {
            this.damage++;
        }
        if (this.damage >= this.attribute.health) this.disabled = true;
        
        return {
            state:          'success',
            data: {
                attack:     this.attribute.attack,
                damageType: this.attribute.damage_type,
                cost:       this.attribute.attack_cost,
                health: {
                    damage: this.damage,
                    max:    this.attribute.health
                },
                disabled:   this.disabled
            }
        };
    }

    /**
     * 防御
     * @returns {Object} 消息
     */
    defense(damageValue) {
        if (this.disabled)              return { state: 'fail', failReason: 'item_disabled' };
        if (this.attribute.defense < 0) return { state: 'fail', failReason: 'action_invalid' };
        
        if (!game.debug.item_no_damage) {
            this.damage++;
        }
        if (this.damage >= this.attribute.health) this.disabled = true;

        let dv = damageValue - this.attribute.defense;
        if (dv < 0) dv = 0;

        return {
            state:                'success',
            data: {
                defense:          this.attribute.defense,
                undefendedDamage: dv,
                cost:             this.attribute.defense_cost,
                health: {
                    damage:       this.damage,
                    max:          this.attribute.health
                },
                disabled:         this.disabled
            }
        }
    }

    /**
     * 不可用：此类型的物品不可堆叠
     * @returns {Number} -1
     */
    join() {
        return -1;
    }
}

class ItemChest extends Item {
    constructor(id) {
        super(id);
        this.chest = {
            loot_table: undefined,
            inventory: []
        }
    }

    /**
     * 开启物品箱
     * @returns {Array<Item>} 物品列表
     */
    open() {
        if (this.disabled) return [];
        if (this.chest.loot_table == undefined) {
            this.disabled = true;
            this.setCount(0);
            return this.chest.inventory;
        } else {
            let chestLootTable = new LootTable(
                this.chest.loot_table,
                {
                    world:  this.origin.world,
                    player: this.origin.player,
                    item:   this
                }
            );
            this.chest.loot_table = undefined;
            this.setCount(0);
            return chestLootTable.getItem();
        }
    }

    /**
     * 不可用：此类型的物品不可堆叠
     * @returns {Number} -1
     */
    join() {
        return -1;
    }
}