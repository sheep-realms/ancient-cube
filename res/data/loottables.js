let db_loottable = {
    test: {
        type: 'generic',
        pools: [
            {
                entries: [
                    {
                        type: 'item',
                        name: 'sword'
                    }, {
                        type: 'item',
                        name: 'dagger'
                    }
                ]
            }
        ]
    },
    chest_generic: {
        type: 'chest',
        pools: [
            {
                entries: [
                    {
                        type: 'item',
                        name: 'emerald'
                    }
                ]
            }
        ]
    },
    chest_generic_weapon: {
        type: 'chest',
        pools: [
            {
                entries: [
                    {
                        type: 'item',
                        name: 'emerald'
                    }, {
                        type: 'item',
                        name: 'sword',
                        weight: 0.4
                    }, {
                        type: 'item',
                        name: 'dagger',
                        weight: 0.2
                    }, {
                        type: 'item',
                        name: 'knife',
                        weight: 0.6
                    }, {
                        type: 'item',
                        name: 'hammer',
                        weight: 0.05
                    }
                ]
            }
        ]
    },
    monster_generic: {
        type: 'monster',
        pools: [
            {
                entries: [
                    {
                        type: 'item',
                        name: 'monster_crystal'
                    }
                ]
            }
        ]
    }
};