let db_generator = {
    test: {
        type: 'generic',
        stages: [
            {
                stage: {
                    min: 0,
                    max: 0
                },
                type: 'generic',
                size: {
                    height: 5,
                    width:  5
                },
                features: {},
                blocks: [
                    {
                        id: 'chest',
                        data: {
                            loot_table: 'chest_generic'
                        },
                        count: 3
                    }, {
                        id: 'monster',
                        count: 2
                    }, {
                        id: 'stair',
                        count: 2
                    }
                ]
            }, {
                stage: {
                    min: 1,
                    max: 2
                },
                type: 'generic',
                size: {
                    height: 5,
                    width:  5
                },
                features: {},
                blocks: [
                    {
                        id: 'chest',
                        data: {
                            loot_table: 'chest_generic'
                        },
                        count: 5
                    }, {
                        id: 'monster',
                        count: 4
                    }, {
                        id: 'stair',
                        count: 2
                    }
                ]
            }, {
                stage: {
                    min: 3,
                    max: 4
                },
                type: 'generic',
                size: {
                    height: 5,
                    width:  5
                },
                features: {},
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
            }, {
                stage: {
                    min: 9,
                    max: 9
                },
                type: 'generic',
                size: {
                    height: 5,
                    width:  5
                },
                features: {
                    chaos: true
                },
                blocks: [
                    {
                        id: 'chest',
                        data: {
                            loot_table: 'chest_generic'
                        },
                        count: 4
                    }, {
                        id: 'monster',
                        count: 1
                    }, {
                        id: 'stair',
                        count: 1
                    }
                ]
            }, {
                stage: {
                    min: 5,
                    max: 8
                },
                type: 'generic',
                size: {
                    height: 6,
                    width:  6
                },
                features: {},
                blocks: [
                    {
                        id: 'chest',
                        data: {
                            loot_table: 'chest_generic'
                        },
                        count: 8
                    }, {
                        id: 'monster',
                        count: 10
                    }, {
                        id: 'stair',
                        count: 2
                    }
                ]
            }, {
                stage: {
                    min: 10,
                    max: Infinity
                },
                type: 'generic',
                size: {
                    height: 7,
                    width:  7
                },
                features: {},
                blocks: [
                    {
                        id: 'chest',
                        data: {
                            loot_table: 'chest_generic'
                        },
                        count: 10
                    }, {
                        id: 'monster',
                        count: 14
                    }, {
                        id: 'stair',
                        count: 2
                    }
                ]
            }
        ]
    }
};