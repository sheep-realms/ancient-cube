let log = new Log();

let game = new Game();

let resource = new Resource();
resource.data.blocks = db_blocks;
resource.data.items = db_items;

let w = new World();
w.create();

let p = new Player(w);
let psi = p.give(new Item('magnifier')).data.inventoryIndex;
let pwi = p.give(new Weapon('sword')).data.inventoryIndex;
p.switchHotbarItem(1, pwi);
p.switchHotbarItem(0, psi);

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

$(document).ready(() => {
    $('#map').attr(
        'style',
        `--map-size: ${Math.max(w.room[0].stage[0].size.height, w.room[0].stage[0].size.width)};` +
        `--map-size-height: ${w.room[0].stage[0].size.height};` +
        `--map-size-width: ${w.room[0].stage[0].size.width};`
    );
    for (let i = 0; i < w.room[0].stage[0].size.height; i++) {
        $('#map').append(`<div id="map-${i}" class="map-row"></div>`);
        for (let j = 0; j < w.room[0].stage[0].size.width; j++) {
            $(`#map-${i}`).append(`<div id="map-${i}-${j}" class="map-block" data-pos-y="${i}" data-pos-x="${j}"></div>`);
        }
    }

    $('#map').on('click', '.map-block', function() {
        let x = $(this).data('pos-x');
        let y = $(this).data('pos-y');
        p.goto(y, x)
    });

    $('#player-hotbar').on('click', '.player-hotbar-item', function() {
        p.selectSlot($(this).data('slot'));
    });

    p.bind('goto', function(e) {
        $sel = $(`#map-${e.pos[0]}-${e.pos[1]}`);
        if (e.state == 'search') {
            $sel.addClass('searched');
            let str = '';
            let strList = [];
            if (e.search.stair > 0) {
                strList.push(`<div class="search-icon stair-${e.search.stair}"></div>`);
            }
            if (e.search.chest > 0) {
                strList.push(`<div class="search-icon chest-${e.search.chest}"></div>`);
            }
            if (e.search.monster > 0) {
                strList.push(`<div class="search-icon monster-${e.search.monster}"></div>`);
            }

            for (let i = 0; i < strList.length; i++) {
                if (i % 2 == 0) {
                    str += `<div class="search-icon-row">${strList[i]}`
                    if (i + 1 >= strList.length) {
                        str += '</div>';
                    }
                } else {
                    str += `${strList[i]}</div>`
                }
            }

            $sel.html(str);
        } else if (e.state == 'event') {
            $sel.addClass('searched');
            $sel.html(`${e.type}`);
        }
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