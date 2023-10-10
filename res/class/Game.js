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
     * @param {Array<Array<Number>>} data 选中的方块
     * @returns {Array<Array<Array<Number>>>} 选区贴图切片ID
     */
    generateSelectedBlockBorder(data = []) {
        let r = [];
        let d = JSON.parse(JSON.stringify(data));

        /**
         * 四角贴图码表
         * 0 - 全边框
         * 1 - 上下边框
         * 2 - 左右边框
         * 3 - 四角内角
         * 4 - 无边框
         */
        const tt = [
            [0, 2, 0, 2, 1, 3, 1, 4],
            [0, 1, 0, 1, 2, 3, 2, 4],
            [0, 2, 0, 2, 1, 3, 1, 4],
            [0, 1, 0, 1, 2, 3, 2, 4]
        ];
        
        /**
         * 四角判定索引表
         * 0b100, 0b10, 0b1
         */
        const bm = [
            [3, 0, 1],
            [1, 2, 4],
            [4, 7, 6],
            [6, 5, 3]
        ];

        // 行
        for (let i = 0; i < data.length; i++) {
            r[i] = [];
            // 列
            for (let j = 0; j < data[i].length; j++) {
                // 非选区返回空值
                if (d[i][j] === 0) {
                    r[i][j] = [4, 4, 4, 4];
                    continue;
                }

                // 兜底
                if (d[i - 1] === undefined) d[i - 1] = [];
                if (d[i]     === undefined) d[i]     = [];
                if (d[i + 1] === undefined) d[i + 1] = [];

                // 四角判定选区
                let b = [
                    d[i - 1][j - 1] ?? 0,   d[i - 1][j] ?? 0,   d[i - 1][j + 1] ?? 0,
                    d[i]    [j - 1] ?? 0,                       d[i]    [j + 1] ?? 0,
                    d[i + 1][j - 1] ?? 0,   d[i + 1][j] ?? 0,   d[i + 1][j + 1] ?? 0,
                ];

                // 编码
                let r1 = [];
                for (let k = 0; k < 4; k++) {
                    r1[k] = tt[k][
                        (   b[bm[k][0]] << 2) + 
                        (   b[bm[k][1]] << 1) + 
                            b[bm[k][2]]
                    ];
                }

                r[i][j] = r1;
            }
        }

        return r;
    }
}