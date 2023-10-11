/**
 * 方块构造器
 * @class
 */
class BlockConstructor {
    constructor() {}

    /**
     * 构造方块
     * @param {Block} block 方块对象
     * @returns {String} DOM
     */
    static getBlock(block) {
        if (block.searched) {
            if (block.type == 'air') {
                let str = '';
                let strList = [];
                if (block.search.stair > 0) {
                    strList.push(`<div class="search-icon stair-${block.search.chaos ? 'n' : block.search.stair}"></div>`);
                }
                if (block.search.chest > 0) {
                    strList.push(`<div class="search-icon chest-${block.search.chaos ? 'n' : block.search.chest}"></div>`);
                }
                if (block.search.monster > 0) {
                    strList.push(`<div class="search-icon monster-${block.search.chaos ? 'n' : block.search.monster}"></div>`);
                }
    
                for (let i = 0; i < strList.length; i++) {
                    if (i % 2 == 0) {
                        str += `<div class="search-icon-row">${strList[i]}`
                        if (i + 1 >= strList.length) {
                            str += '</div>';
                        }
                    } else {
                        str += `${strList[i]}</div>`
                    }
                }
    
                return this.getBlockContainer(
                    str,
                    {
                        pos: {
                            x: block.pos.x,
                            y: block.pos.y
                        },
                        class: 'searched'
                    }
                );
            } else {
                switch (block.type) {
                    case 'chest':
                    case 'monster':
                        return this.getBlockContainer(
                            `<div class="event ${block.type} ${block.damaged ? 'damaged' : ''}"></div>`,
                            {
                                pos: {
                                    x: block.pos.x,
                                    y: block.pos.y
                                },
                                class: 'searched ' + block.type
                            }
                        );

                    case 'stair':
                        return this.getBlockContainer(
                            `<div class="event ${block.type}"></div>`,
                            {
                                pos: {
                                    x: block.pos.x,
                                    y: block.pos.y
                                },
                                class: 'searched ' + block.type
                            }
                        );

                
                    default:
                        return this.getBlockContainer(
                            block.type,
                            {
                                pos: {
                                    x: block.pos.x,
                                    y: block.pos.y
                                },
                                class: 'searched ' + block.type
                            }
                        );
                }
            }
        } else {
            if (block.type == 'wall') {
                return this.getBlockContainer(
                    '',
                    {
                        pos: {
                            x: block.pos.x,
                            y: block.pos.y
                        },
                        class: 'wall'
                    }
                );
            } else {
                return this.getBlockContainer(
                    '',
                    {
                        pos: {
                            x: block.pos.x,
                            y: block.pos.y
                        }
                    }
                );
            }
        }
    }

    static getBlockContainer(content = '', data = {}) {
        data = {
            ...{
                pos: {
                    x: 0,
                    y: 0
                },
                class: ''
            },
            ...data
        };
        return `<div id="map-${data.pos.y}-${data.pos.x}" class="map-block ${data.class}" data-pos-y="${data.pos.y}" data-pos-x="${data.pos.x}">${content}<div class="cover"><div class="attack"></div></div></div>`;
    }
}

/**
 * 地图构造器
 * @class
 */
class MapConstructor {
    constructor() {}

    /**
     * 构造地图
     * @param {Stage} stage 楼层对象
     * @returns {String} DOM
     */
    static getMap(stage) {
        let before = `<div id="map" style="--map-size: ${Math.max(stage.size.height, stage.size.width)}; --map-size-height: ${stage.size.height}; --map-size-width: ${stage.size.width};">`;
        let str    = '';
        for (let i = 0; i < stage.size.height; i++) {
            str += `<div id="map-${i}" class="map-row">`;
            for (let j = 0; j < stage.size.width; j++) {
                str += BlockConstructor.getBlock(stage.map[i][j]);
            }
            str += `</div>`;
        }
        return before + str + '</div>';
    }
}

/**
 * 物品栏构造器
 * @class
 */
class InventoryConstructor {
    constructor() {}

    /**
     * 构造单个物品栏
     * @param {Item} item 物品
     * @returns {String} DOM
     */
    static getItem(item, slot, data = {}) {
        if (item == undefined) return InventoryConstructor.getAir(slot, data);
        return `<div ${data?.id ? `id="${data.id}"` : ''} class="inventory-item${data?.class ? ` ${data.class}` : ''}" data-slot="${slot}">
                <div class="item-icon" data-item-type="${item.type}" data-item-id="${item.id}"></div>
                ${InventoryConstructor.getDamageBar(item)}
                ${ item.count > 1 ? `<div class="item-count">${item.count}</div>` : '' }
            </div>`;
    }

    static getAir(slot, data = {}) {
        return `<div ${data?.id ? `id="${data.id}"` : ''} class="inventory-item${data?.class ? ` ${data.class}` : ''}" data-slot="${slot}">
                <div class="item-icon" data-item-type="air" data-item-id="air"></div>
            </div>`;
    }

    /**
     * 构造整个物品栏
     * @param {Array<Item>} inventory 物品栏
     * @returns {String} DOM
     */
    static getInventory(inventory) {
        let dom = '';
        for (let i = 0; i < inventory.length; i++) {
            dom += InventoryConstructor.getItem(
                inventory[i],
                i,
                {
                    id: `inventory-slot-${i}`
                }
            );
        }

        return dom;
    }

    /**
     * 构造耐久度条
     * @param {Item} item 物品
     * @returns {String} DOM
     */
    static getDamageBar(item) {
        if (item?.attribute == undefined) {
            return '';
        } else if (item.attribute?.health == undefined || item.attribute?.health == 0) {
            return '';
        }

        let value = (item.attribute.health - item.damage) / item.attribute.health,
            type  = '';

        if(value >= 0.75) {
            
        } else if(value >= 0.5) {
            type = 'damage-1';
        } else if(value >= 0.25) {
            type = 'damage-2';
        } else if(value >= 0.1) {
            type = 'damage-3';
        } else {
            type = 'damage-4';
        }

        return `<div class="item-damage-bar${ item.damage > 0 ? '' : ' hide' }">
                <div class="item-damage-value ${type}" style="--value: ${ value * 100 }%;"></div>
            </div>`;
    }

    /**
     * 构造快捷栏
     * @param {Array<Item>} hotbar 快捷栏
     * @param {Number} selected 已选择的栏位
     * @returns {String} DOM
     */
    static getHotbar(hotbar, selected = 0) {
        let dom = '';
        for (let i = 0; i < hotbar.length; i++) {
            dom += InventoryConstructor.getItem(
                hotbar[i],
                i,
                {
                    id: `player-hotbar-${i}`,
                    class: `player-hotbar-item${ i == selected ? ' selected' : '' }`
                }
            );
        }

        return `<div id="player-hotbar" class="">${dom}</div>`;
    }
}