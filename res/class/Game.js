class Game {
    constructor() {

    }

    randomSort(arr) {
        let index,
            randomIndex,
            temp,
            len = arr.length;

        for (index = 0; index < len; index++) {
            randomIndex      = Math.floor(Math.random() * (len - index)) + index;

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
}