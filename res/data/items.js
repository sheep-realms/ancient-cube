let db_items = [
    {
        id: 'magnifier',
        type: 'search'
    }, {
        id: 'emerald',
        type: 'item'
    }, {
        id: 'monster_crystal',
        type: 'item'
    }, {
        id: 'soul_camera',
        type: 'item'
    }, {
        id: 'soul_camera_using',
        type: 'item'
    }, {
        id: 'soul_camera_used',
        type: 'item'
    }, {
        id: 'sword',
        type: 'weapon',
        data: {
            attribute: {
                attack: 2,
                defense: 1,
                attack_cost: 1,
                defense_cost: 0,
                health: 50
            }
        }
    }, {
        id: 'dagger',
        type: 'weapon',
        data: {
            attribute: {
                attack: 1,
                defense: 1,
                attack_cost: 0,
                defense_cost: 1,
                health: 75
            }
        }
    }, {
        id: 'knife',
        type: 'weapon',
        data: {
            attribute: {
                attack: 1,
                defense: 0,
                attack_cost: 0,
                defense_cost: 0,
                health: 25
            }
        }
    }, {
        id: 'spear',
        type: 'weapon',
        data: {
            attribute: {
                attack: 2,
                defense: 0,
                attack_cost: 1,
                defense_cost: 0,
                health: 50
            }
        }
    }, {
        id: 'kunai',
        type: 'weapon',
        data: {
            attribute: {
                attack: 3,
                defense: 0,
                attack_cost: 1,
                defense_cost: 0,
                health: 100
            }
        }
    }, {
        id: 'broadsword',
        type: 'weapon',
        data: {
            attribute: {
                attack: 4,
                defense: 3,
                attack_cost: 3,
                defense_cost: {
                    type: 'lens',
                    value: {
                        max: 3,
                        min: 1
                    }
                },
                health: 100
            }
        }
    }, {
        id: 'hammer',
        type: 'weapon',
        data: {
            attribute: {
                attack: 3,
                defense: 0,
                attack_cost: 2,
                defense_cost: 0,
                health: 200
            }
        }
    }, {
        id: 'crowbar',
        type: 'weapon',
        data: {
            attribute: {
                attack: 2,
                defense: 1,
                attack_cost: 1,
                defense_cost: 1,
                health: 500
            }
        }
    }, {
        id: 'rapier',
        type: 'weapon',
        data: {
            attribute: {
                attack: 2,
                defense: 2,
                attack_cost: 1,
                defense_cost: 0,
                health: 35
            }
        }
    }, {
        id: 'teach_weapon',
        type: 'weapon',
        data: {
            attribute: {
                attack: 0,
                defense: 1,
                attack_cost: 1,
                defense_cost: 0,
                health: 35
            }
        }
    }, {
        id: 'golden_chest',
        type: 'chest'
    }, {
        id: 'silver_chest',
        type: 'chest'
    }, {
        id: 'copper_chest',
        type: 'chest'
    }, {
        id: 'blood_chest',
        type: 'chest',
        data: {
            chest: {
                open_cost: {
                    health: 1
                }
            }
        }
    }, {
        id: 'emerald_chest',
        type: 'chest',
        data: {
            chest: {
                open_cost: {
                    item: {
                        id: 'emerald',
                        count: 1
                    }
                }
            }
        }
    }, {
        id: 'bottle',
        type: 'water_bottle'
    }, {
        id: 'water_bottle',
        type: 'water_bottle',
        data: {
            liquid: 'water'
        }
    }, {
        id: 'instant_health_potion_t2',
        type: 'water_bottle',
        data: {
            effect: [
                {
                    id: 'instant_health',
                    level: 4,
                    round: 1
                }
            ],
            liquid: 'water'
        }
    }
];