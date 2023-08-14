class Game {
    constructor() {
        this.config = {
            view: {
                block_size_minimum: '55px',
                screen_safety_height: '90vh',
                screen_safety_width: '90vw',
                screen_scale: 1
            },
            security: {
                damage_maximum: 1024,
                loot_table_stack_depth_limit: 256,
                number_providers_stack_depth_limit: 256
            }
        };
        this.debug = {};
    }

    randomSort(arr) {
        let index,
            randomIndex,
            temp,
            len = arr.length;

        for (index = 0; index < len; index++) {
            randomIndex      = Math.floor(SMath.randomFloat() * (len - index)) + index;

            temp             = arr[index];
            arr[index]       = arr[randomIndex];
            arr[randomIndex] = temp;
        }

        return arr;
    }

    randomStageGenerate(height, width, start = [0, 0], data = {}) {
        let blockCount   = height * width - 1,
            chestCount   = data?.chestCount   ? data.chestCount   : 0,
            stairCount   = data?.stairCount   ? data.stairCount   : 0,
            monsterCount = data?.monsterCount ? data.monsterCount : 0,
            useBlocks    = chestCount + stairCount + monsterCount,
            airCount     = blockCount - useBlocks;

        if (useBlocks > blockCount) {
            log.error('Used blocks exceed the maximum available blocks.', 'class/Game.js > Gams > randomStageGenerate()');
            return;
        }

        let blocks = [];

        for (let i = 0; i < chestCount;   i++) { blocks.push('chest'); }
        for (let i = 0; i < stairCount;   i++) { blocks.push('stair'); }
        for (let i = 0; i < monsterCount; i++) { blocks.push('monster'); }
        for (let i = 0; i < airCount;     i++) { blocks.push('air'); }

        let blocksRandom = this.randomSort(blocks);

        let map = [];
        for (let i = 0; i < height; i++) {
            map[i] = [];
            for (let j = 0; j < width; j++) {
                if (i == start[0] && j == start[1]) {
                    map[i][j] = 'air';
                } else {
                    map[i][j] = blocksRandom.shift();
                }
            }
        }

        return map;
    }

    /**
     * 获取选区边界切片
     * @param {Array<Array>} data 选中的方块
     */
    generateSelectedBlockBorder(data = []) {
        let r = [];
        let d = JSON.parse(JSON.stringify(data));
        let tt = [
            [0, 2, 0, 2, 1, 3, 1, 4],
            [0, 1, 0, 1, 2, 3, 2, 4],
            [0, 2, 0, 2, 1, 3, 1, 4],
            [0, 1, 0, 1, 2, 3, 2, 4]
        ];
        for (let i = 0; i < data.length; i++) {
            r[i] = [];
            for (let j = 0; j < data[i].length; j++) {
                if (d[i][j] == 0) {
                    r[i][j] = [0, 0, 0, 0];
                    continue;
                }

                let r1 = [];
                let t1, t2, t3;

                if (d[i - 1] == undefined) d[i - 1] = [];
                if (d[i]     == undefined) d[i]     = [];
                if (d[i + 1] == undefined) d[i + 1] = [];

                // ↖
                t1 = (d[i]    [j - 1] != undefined ? d[i]    [j - 1] : 0) << 2;
                t2 = (d[i - 1][j - 1] != undefined ? d[i - 1][j - 1] : 0) << 1;
                t3 =  d[i - 1][j]     != undefined ? d[i - 1][j]     : 0;
                r1[0] = tt[0][t1 + t2 + t3];

                // ↗
                t1 = (d[i - 1][j]     != undefined ? d[i - 1][j]     : 0) << 2;
                t2 = (d[i - 1][j + 1] != undefined ? d[i - 1][j + 1] : 0) << 1;
                t3 =  d[i]    [j + 1] != undefined ? d[i]    [j + 1] : 0;
                r1[1] = tt[1][t1 + t2 + t3];
                
                // ↘
                t1 = (d[i]    [j + 1] != undefined ? d[i]    [j + 1] : 0) << 2;
                t2 = (d[i + 1][j + 1] != undefined ? d[i + 1][j + 1] : 0) << 1;
                t3 =  d[i + 1][j]     != undefined ? d[i + 1][j]     : 0;
                r1[2] = tt[2][t1 + t2 + t3];

                // ↙
                t1 = (d[i + 1][j]     != undefined ? d[i + 1][j]     : 0) << 2;
                t2 = (d[i + 1][j - 1] != undefined ? d[i + 1][j - 1] : 0) << 1;
                t3 =  d[i]    [j - 1] != undefined ? d[i]    [j - 1] : 0;
                r1[3] = tt[3][t1 + t2 + t3];

                r[i][j] = r1;
            }
        }

        return r;
    }
}