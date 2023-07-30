let db_generator = {
    test: {
        type: 'generic',
        stages: [
            {
                stage: {
                    min: 0,
                    max: 4
                },
                type: 'generic',
                size: {
                    height: 5,
                    width:  5
                },
                features: {
                    waterlogged: false
                },
                blocks: [
                    {
                        id: 'chest',
                        data: {
                            loot_table: 'chest_generic'
                        },
                        count: 5
                    }, {
                        id: 'monster',
                        count: 6
                    }, {
                        id: 'stair',
                        count: 2
                    }
                ]
            }
        ]
    }
};