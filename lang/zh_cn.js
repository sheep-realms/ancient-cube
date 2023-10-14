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
        blood_chest: "吸血宝箱",
        bottle: "空瓶",
        broadsword: "阔剑",
        copper_chest: "铜宝箱",
        crowbar: "撬棍",
        dagger: "短剑",
        emerald: "绿宝石",
        emerald_chest: "绿宝石宝箱",
        golden_chest: "金宝箱",
        hammer: "锤子",
        instant_health_potion_t2: "治疗药水",
        knife: "小刀",
        kunai: "苦无",
        magnifier: "放大镜",
        monster_crystal: "怪物水晶",
        rapier: "细剑",
        silver_chest: "银宝箱",
        soul_camera: "灵魂相机",
        soul_camera_used: "已失效的灵魂相机",
        soul_camera_using: "已激活的灵魂相机",
        spear: "长枪",
        sword: "长剑",
        teach_weapon: "练习木剑",
        water_bottle: "水瓶"
    }
}