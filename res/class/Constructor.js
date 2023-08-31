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