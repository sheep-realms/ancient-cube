class PatchPanel {
    constructor () {
        this.boundDOM  = {
            game:  '',
            input: 'input:not([disabled])',
        };
        this.inputMode = false;
        this.event     = {
            inventory: 69,
            hotbar_1:  49,
            hotbar_2:  50,
            hotbar_3:  51,
            hotbar_4:  52,
            hotbar_5:  53,
            hotbar_6:  54,
            hotbar_7:  55,
            hotbar_8:  56,
            hotbar_9:  57,
            debug:     114
        };
        this.__map     = [];
        this.player    = undefined;
    }

    init(player) {
        this.player = player;
        for (const key in this.event) {
            if (Object.hasOwnProperty.call(this.event, key)) {
                const e = this.event[key];
                this.__map[e] = key;
            }
        }
    }

    bind(game, input = 'input:not([disabled])') {
        this.boundDOM = {
            game:  game,
            input: input
        }
    }

    listen() {
        let that = this;
        $(document).on('keydown', function(e) {
            that.input(e);
        });
    }

    input(event) {
        // console.log(event.keyCode)
        switch (this.__map[event.keyCode]) {
            case 'hotbar_1':
                this.player.selectSlot(0);
                break;

            case 'hotbar_2':
                this.player.selectSlot(1);
                break;

            case 'debug':
                event.preventDefault();
                if (game.debug.master) {
                    game.debug.master = false;
                } else {
                    game.debug.master = true;
                }
                break;
        
            default:
                break;
        }
    }
}