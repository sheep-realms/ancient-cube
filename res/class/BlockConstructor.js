class BlockConstructor {
    constructor() {

    }

    static getBlock(block) {
        if (block.searched) {
            if (block.type == 'air') {
                let str = '';
                let strList = [];
                if (block.search.stair > 0) {
                    strList.push(`<div class="search-icon stair-${block.search.stair}"></div>`);
                }
                if (block.search.chest > 0) {
                    strList.push(`<div class="search-icon chest-${block.search.chest}"></div>`);
                }
                if (block.search.monster > 0) {
                    strList.push(`<div class="search-icon monster-${block.search.monster}"></div>`);
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
                return this.getBlockContainer(
                    block.type,
                    {
                        pos: {
                            x: block.pos.x,
                            y: block.pos.y
                        },
                        class: 'searched'
                    }
                );
            }
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
        return `<div id="map-${data.pos.y}-${data.pos.x}" class="map-block ${data.class}" data-pos-y="${data.pos.y}" data-pos-x="${data.pos.x}">${content}</div>`;
    }
}