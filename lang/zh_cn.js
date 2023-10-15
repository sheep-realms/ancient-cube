const lang_zh_cn = {
    gui: {
        action: {
            attack: "攻击",
            search: "探索"
        }
    },
    command: {
        common: {
            fail: {
                exceed_maximum_value: "逻辑错误：'{n}' 太大了，最大只能为 {max}",
                exceed_minimum_value: "逻辑错误：'{n}' 太小了，最小只能为 {min}",
                invalid_json: "语法错误：无效的 JSON",
                invalid_number: "语法错误：无效的数字",
                invalid_block: "不存在名为 '{value}' 的方块",
                invalid_item: "不存在名为 '{value}' 的物品",
                invalid_loottable: "不存在名为 '{value}' 的战利品表",
                missing_parameter: "语法错误：缺少必要参数"
            }
        },
        damage: {
            success: "已对玩家造成 {n} 点伤害",
            fail: {
                invalid_request: "无法对玩家造成伤害"
            }
        },
        give: {
            success: "已给予玩家 {name} * {n}",
            fail: {
                invalid_request: "无法给予玩家物品"
            }
        },
        kill: {
            success: "已杀死玩家",
            fail: {
                invalid_request: "无法杀死玩家"
            }
        },
        loottable: {
            success: {
                ok: "已生成战利品表并给予玩家",
                no_item: "已生成战利品表，但没有获得任何物品"
            },
            fail: {
                invalid_request: "无法给予玩家物品"
            }
        },
        regeneration: {
            success: "已使玩家恢复 {n} 点生命",
            fail: {
                health_maximum: "玩家生命已达最大值",
                invalid_request: "无法使玩家恢复生命"
            }
        }
    },
    dead: {
        chest_open_cost: "你在开启 {name} 时透支了所有生命",
        chest_open_cost_unknow: "你在开启宝箱时透支了所有生命",
        monster_attack: "你被 {name} 杀死了",
        monster_attack_at_chest_open_cost: "你因为开启宝箱支付了过多生命而被 {name} 终结了",
        monster_attack_unknow: "你被怪物杀死了",
        system: "你被来自系统的力量杀死了",
        unknow: "你被一股未知的神秘力量杀死了"
    },
    block: {
        air: "空气",
        chest: "宝箱",
        slime: "史莱姆",
        stair: "楼梯",
        tentacle: "触手"
    },
    item: {
        blood_chest: {
            name: "吸血宝箱",
            description: "以你的生命作为开启宝箱的代价。"
        },
        bottle: {
            name: "空瓶",
            description: "一种可以容纳液体的容器。"
        },
        broadsword: {
            name: "阔剑",
            description: "举起它十分费力，造成的伤害也十分可观。"
        },
        copper_chest: {
            name: "铜宝箱",
            description: "普通的宝箱。"
        },
        crowbar: {
            name: "撬棍",
            description: "结实可靠的物理学圣剑。"
        },
        dagger: {
            name: "短剑",
            description: "小巧灵活，可攻可守。"
        },
        emerald: {
            name: "绿宝石",
            description: "一种可以充当货币的宝石。"
        },
        emerald_chest: {
            name: "绿宝石宝箱",
            description: "支付绿宝石作为开启宝箱的代价。"
        },
        golden_chest: {
            name: "金宝箱",
            description: "华丽的宝箱。"
        },
        hammer: {
            name: "锤子",
            description: "结实可靠的动能武器。"
        },
        instant_health_potion_t2: {
            name: "治疗药水",
            description: "可以略微恢复生命。"
        },
        knife: {
            name: "小刀",
            description: "小巧灵活，适合突袭，甚至可以充当异世界转生装置。"
        },
        kunai: {
            name: "苦无",
            description: "可远程攻击，攻击力不亚于常见武器。"
        },
        magnifier: {
            name: "放大镜",
            description: "探索所需的必备道具。"
        },
        monster_crystal: {
            name: "怪物水晶",
            description: "怪物心脏的一部分，是怪物的能量来源。"
        },
        rapier: {
            name: "细剑",
            description: "比短剑更长，但同时也保留了灵活性。作为代价，它很容易损坏。"
        },
        silver_chest: {
            name: "银宝箱",
            description: "精致的宝箱。"
        },
        soul_camera: {
            name: "灵魂相机",
            description: "一种用途未知的古物。"
        },
        soul_camera_used: {
            name: "已失效的灵魂相机",
            description: "一种用途未知的古物，看起来已经被使用过了。"
        },
        soul_camera_using: {
            name: "已激活的灵魂相机",
            description: "一种用途未知的古物，看起来内部的装置正在运转，并发出了奇妙的光芒。"
        },
        spear: {
            name: "长枪",
            description: "更长的攻击距离会让你更有优势。"
        },
        sword: {
            name: "长剑",
            description: "很常见的近战武器，可攻可守。"
        },
        teach_weapon: {
            name: "练习木剑",
            description: "一种练习道具，无法造成伤害。"
        },
        water_bottle: {
            name: "水瓶",
            description: "普通的一瓶水。"
        }
    }
}