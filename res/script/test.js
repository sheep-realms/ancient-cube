let log = new Log();

let game = new Game();

game.debug = new Debuger();

let resource = new Resource();
resource.data.blocks = db_blocks;
resource.data.items = db_items;
resource.data.loottable = db_loottable;
resource.data.generator = db_generator;

let w = new World();
w.create(new Generator('test'));

let p = new Player(w);
w.playerJoin(p);
let psi = p.replaceItem(0, new Item('magnifier'));
let pwi = p.replaceItem(1, new Weapon('sword'));
p.switchHotbarItem(1, 1);
p.switchHotbarItem(0, 0);

let messager = new Messager('#message');

log.bind('errorMessageOutput', function(e) {
    messager.send(e.message, 'color: red;');
});

game.debug.bind('debugMessageOutput', function(e) {
    messager.send(`[DEBUG] ${e.name} = ${e.value}`, 'color: lightgray; font-style: italic;');
});

let patchPanel = new PatchPanel();
patchPanel.bind('#game');
patchPanel.messager = messager;
patchPanel.init(p);
patchPanel.listen();

let pixelHotkeys = new PixelHotkeys();
pixelHotkeys.setImage('../img/keys.png');
pixelHotkeys.setMap(img2keys);
pixelHotkeys.setIndex(index_keys);

let translator = new Translator();
function $t(key, variable={}) {
    return translator.output(key, variable);
}
translator.load(lang_zh_cn);

// let ts_map = [
//     ['air', 'air', 'air', 'chest', 'monster'],
//     ['air', 'air', 'air', 'monster', 'air'],
//     ['monster', 'air', 'chest', 'air', 'air'],
//     ['air', 'air', 'air', 'air', 'monster'],
//     ['air', 'monster', 'air', 'monster', 'monster']
// ];

// w.room[0].stage[0].setMap(ts_map);

// let rd_map = game.randomStageGenerate(5,5,[0,0],{chestCount:5,monsterCount:7});

// w.room[0].stage[0].setMap(rd_map);

let timer = {
    healthDamage: 0,
    heartbeat: 0
};

function getHealthIcon(value, max) {
    let icon = [];
    for (let i = 1; i <= max; i += 2) {
        if (i + 1 <= value) {
            icon.push('heart');
        } else if (i == value) {
            icon.push('heart-half');
        } else {
            icon.push('none');
        }
    }
    return icon;
}

function getHealthDamageIcon(e) {
    let icon = [];
    for (let i = 1; i < e.healthMax; i += 2) {
        if (i + 1 <= e.health) {
            icon.push('heart');
        } else if (i == e.health) {
            if (e.lastHealth > e.damage) {
                icon.push('damage-right-half');
            } else {
                icon.push('heart-half');
            }
        } else {
            if (i + 1 <= e.lastHealth) {
                icon.push('damage');
            } else if (i == e.lastHealth) {
                icon.push('damage-half');
            } else {
                icon.push('none');
            }
        }
    }
    return icon;
}

function loadMap(stage) {
    $('#map').replaceWith(MapConstructor.getMap(stage));
}


let preloadImages = [
    'res/img/block/default.png',
    'res/img/event/chest.png',
    'res/img/event/monster.png',
    'res/img/event/misc.png',
    'res/img/gui/cover.png',
    'res/img/gui/heart.png',
    'res/img/gui/keys.png',
    'res/img/icon/search.png',
    'res/img/item/item.png',
    'res/img/item/weapon.png'
];

$(document).ready(() => {
    preloadImages.forEach(e => {
        $('#preload').append(`<img src="${e}">`);
    });

    loadMap(w.room[0].stage[0]);

    $('#keys-bar').html(pixelHotkeys.getKeyDOM('msl | ' + $t('gui.action.search')));

    $('#title-screen').click(function() {
        $('#title-screen').addClass('hide');
    });

    $('#game').on('click', '.map-block', function() {
        let x = $(this).data('pos-x');
        let y = $(this).data('pos-y');
        p.goto(y, x)
    });

    $('#player-hotbar').on('click', '.player-hotbar-item', function() {
        p.selectSlot($(this).data('slot'));
    });

    p.bind('goto', function(e) {
        $(`#map-${e.pos[0]}-${e.pos[1]}`).replaceWith(BlockConstructor.getBlock(e.block));
    });

    p.bind('updateAttribute', function(e) {
        let a = getHealthIcon(e.health, e.healthMax);
        let $sel = $('#player-state-hp');
        $sel.html('');
        a.forEach(s => {
            $sel.append(`<span class="heart-bg ${s == 'heart' ? '' : s}"><span class="heart"></span></span>`);
        });
    });

    p.bind('healthDamage', function(e) {
        let icons = getHealthDamageIcon(e);
        let $sel = $('#player-state-hp>.heart-bg');
        for (let i = 0; i < icons.length; i++) {
            switch (icons[i]) {
                case 'heart':
                    $sel.eq(i).attr('class', 'heart-bg')
                    break;

                case 'damage-right-half':
                    $sel.eq(i).attr('class', 'heart-bg damage-right-half heart-half')
                    break;

                case 'heart-half':
                    $sel.eq(i).attr('class', 'heart-bg heart-half')
                    break;

                case 'damage':
                    $sel.eq(i).attr('class', 'heart-bg damage none')
                    break;

                case 'damage-half':
                    $sel.eq(i).attr('class', 'heart-bg damage-half none')
                    break;

                case 'none':
                    $sel.eq(i).attr('class', 'heart-bg none')
                    break;
            
                default:
                    break;
            }
        }

        $('#player-state-hp').addClass('flicker');
        clearTimeout(timer.healthDamage);
        timer.healthDamage = setTimeout(function () {
            $('#player-state-hp').removeClass('flicker');
            $sel.removeClass('damage-right-half damage damage-half');
        }, 1125);

        if (e.deathDefend) {
            clearTimeout(timer.heartbeat);
            $('#screen-mask').removeClass('heartbeat');
            $('#screen-mask').addClass('heartbeat-deathdefend');
            timer.heartbeat = setTimeout(function () {
                $('#screen-mask').removeClass('heartbeat heartbeat-deathdefend');
            }, 8000);
        } else if (e.health == 1 && e.damage > 0) {
            clearTimeout(timer.heartbeat);
            $('#screen-mask').addClass('heartbeat');
            timer.heartbeat = setTimeout(function () {
                $('#screen-mask').removeClass('heartbeat heartbeat-deathdefend');
            }, 8000);
        }
    });

    p.bind('dead', function(e) {
        screenEffectPlayerDeath(e.lastPos[0], e.lastPos[1]);
    });

    p.bind('updateHotbar', function(e) {
        let damage = e.hotbar[1].damage;
        let health = e.hotbar[1].attribute.health;
        let value = (health - damage) / health;
        if (value < 0) value = 0;
        if (value > 1) value - 1;
        $('#player-hotbar-1 .item-damage-value').attr('style', `--value: ${value * 100}%;`);
        if (value != 1) $('#player-hotbar-1 .item-damage-bar').removeClass('hide');
        $('.player-hotbar-item').removeClass('selected');
        $('#player-hotbar-' + e.selectedSlot).addClass('selected');

        $('#player-hotbar-1 .item-damage-value').removeClass('damage-1 damage-2 damage-3 damage-4');

        if(value >= 0.75) {
            
        } else if(value >= 0.5) {
            $('#player-hotbar-1 .item-damage-value').addClass('damage-1');
        } else if(value >= 0.25) {
            $('#player-hotbar-1 .item-damage-value').addClass('damage-2');
        } else if(value >= 0.1) {
            $('#player-hotbar-1 .item-damage-value').addClass('damage-3');
        } else {
            $('#player-hotbar-1 .item-damage-value').addClass('damage-4');
        }

        if (e.hotbar[e.selectedSlot].type == 'weapon') {
            $('#game').addClass('action-attack');
            $('#keys-bar').html(pixelHotkeys.getKeyDOM('msl | ' + $t('gui.action.attack')));
        } else {
            $('#game').removeClass('action-attack');
            $('#keys-bar').html(pixelHotkeys.getKeyDOM('msl | ' + $t('gui.action.search')));
        }
    });

    p.bind('updateMap', function(e) {
        loadMap(e);
    });
});


function screenEffectPlayerDeath(y, x) {
    let size = $(`#map-${y}-${x}`).eq(0).width();
    let offset = $(`#map-${y}-${x}`).eq(0).offset();
    let cpos = {
        top: offset.top + size / 2,
        left: offset.left + size / 2
    };
    $('#screen-effect').append(`<div class="screen-effect-player-death-1" style="--box-pos-top: ${cpos.top}px; --box-pos-left: ${cpos.left}px;"></div>
<div class="screen-effect-player-death-2" style="--box-pos-top: ${cpos.top}px; --box-pos-left: ${cpos.left}px;"></div>`);
}