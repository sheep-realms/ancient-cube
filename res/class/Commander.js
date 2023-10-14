class Commander {
    constructor() {
        this.link = {
            messager: undefined,
            player:   undefined,
            resource: undefined,
            world:    undefined
        };
        this.value = {
            block: [],
            item: [],
            loottable: []
        };
        this.commands = [
            {
                name: 'damage',
                parameters: [
                    {
                        type: 'number',
                        required: true,
                        value: {
                            min: 1
                        }
                    }, {
                        type: 'string'
                    }, {
                        type: 'json'
                    }
                ]
            }, {
                name: 'give',
                parameters: [
                    {
                        type: 'value',
                        value: 'item',
                        required: true
                    }, {
                        type: 'number',
                        value: {
                            min: 1
                        }
                    }, {
                        type: 'json'
                    }
                ]
            }, {
                name: 'kill',
                parameters: []
            }, {
                name: 'loottable',
                parameters: [
                    {
                        type: 'value',
                        value: 'loottable',
                        required: true
                    }
                ]
            }, {
                name: 'regeneration',
                parameters: [
                    {
                        type: 'number',
                        required: true,
                        value: {
                            min: 1
                        }
                    }
                ]
            }, {
                name: 'say',
                parameters: [
                    {
                        type: 'text',
                        required: true
                    }
                ]
            }
        ];
    }

    deployment() {
        let list = [
            'block',
            'item'
        ];
        let listObj = [
            'loottable'
        ];

        list.forEach(e => {
            this.link.resource.data[e].forEach(e2 => {
                this.value[e].push(e2.id);
            });
            this.value[e].sort();
        });

        listObj.forEach(e => {
            for (const key in this.link.resource.data[e]) {
                if (Object.hasOwnProperty.call(this.link.resource.data[e], key)) {
                    const e2 = this.link.resource.data[e][key];
                    this.value[e].push(key);
                    this.value[e].sort();
                }
            }
        });
    }

    run(command = '') {
        let cmds = command.split(' ');

        // 查找命令
        let targetCmd = this.commands.find(function(e) {
            return e.name == cmds[0];
        });
        // 未找到命令
        if (targetCmd == undefined) {
            return;
        }

        cmds.shift();

        let pcobj = this.__parameterConstructor(targetCmd, cmds);

        if (pcobj.state != 'success') {
            return pcobj;
        }

        cmds = pcobj.data.parameters;

        let r = this[targetCmd.name](...cmds);

        return r;
    }

    consoleRun(command = '') {
        let r = this.run(command);
        if (r?.message == undefined) return r;
        let msg = $t(
            r.message.key,
            r.message.variable
        );

        if (r.state == 'success') {
            this.link.messager.send(msg);
        } else {
            this.link.messager.sendError(msg);
        }

        return r;
    }

    fn(commands = []) {
        if (typeof commands == 'string') {
            commands = commands.split('\n');
        }

        let success = 0,
            fail = 0,
            failLog = [];

        for (let i = 0; i < commands.length; i++) {
            let r = this.run(commands[i]);
            if (r.state == 'success') {
                success++;
            } else {
                fail++;
                failLog.push({
                    line: i + 1,
                    reason: r.failReason
                });
            }
        }

        return {
            state: {
                success: success,
                fail: fail
            },
            log: {
                fail: failLog
            }
        };
    }

    __parameterConstructor(targetCmd, inputCmds = []) {
        let newCmd = [];
        for (let i = 0; i < targetCmd.parameters.length; i++) {
            let par = targetCmd.parameters[i];

            if (inputCmds[0] == undefined || inputCmds[0] == '') {
                if (par.required) {
                    return this.__messageConstructor(
                        'common',
                        { state: 'fail', failReason: 'missing_parameter' }
                    );
                } else {
                    break;
                }
            }

            let p, pcheck;
            switch (par.type) {
                case 'text':
                    newCmd.push(inputCmds.join(' '));
                    inputCmds = [];
                    break;
                
                case 'number':
                    p = Number(inputCmds.shift());
                    pcheck = this.__parameterCheckNumber(p, par);
                    if (pcheck.state != 'success') return pcheck;
                    newCmd.push(p)
                    break;

                case 'json':
                    p = inputCmds.join(' ');
                    inputCmds = [];
                    let pjson;
                    try {
                        pjson = JSON.parse(p);
                    } catch (error) {
                        return this.__messageConstructor(
                            'common',
                            { state: 'fail', failReason: 'invalid_json' }
                        );
                    }
                    newCmd.push(pjson)
                    break;

                case 'value':
                    p = inputCmds.shift();
                    pcheck = this.__parameterCheckValueList(par.value, p);
                    if (pcheck.state != 'success') return pcheck;
                    newCmd.push(p)
                    break;
            
                default:
                    newCmd.push(inputCmds.shift());
                    break;
            }
        }
        return {
            state: 'success',
            data: {
                parameters: newCmd
            }
        };
    }

    __parameterCheckNumber(value, parameter) {
        if (Number.isNaN(value)) {
            return this.__messageConstructor(
                'common',
                { state: 'fail', failReason: 'invalid_number' }
            );
        }

        if (parameter?.value != undefined) {
            if (parameter.value?.max != undefined) {
                if (value > parameter.value.max) {
                    return this.__messageConstructor(
                        'common',
                        { state: 'fail', failReason: 'exceed_maximum_value' },
                        { n: value, max: parameter.value.max }
                    );
                }
            }

            if (parameter.value?.min != undefined) {
                if (value < parameter.value.min) {
                    return this.__messageConstructor(
                        'common',
                        { state: 'fail', failReason: 'exceed_minimum_value' },
                        { n: value, min: parameter.value.min }
                    );
                }
            }
        }

        return { state: 'success', data: {} };
    }

    __parameterCheckValueList(type, value) {
        let i = this.value[type].indexOf(value);
        
        if (i == -1) {
            return this.__messageConstructor(
                'common',
                { state: 'fail', failReason: 'invalid_' + type },
                { value: value }
            );
        };

        return { state: 'success', data: {} };
    }

    __messageConstructor(command, rt, variable = {}, after = undefined) {
        if (rt.state == 'success') {
            rt.message = {
                key: `command.${command}.success${ after ? '.' + after : ''}`,
                variable: variable
            };
        } else {
            rt.message = {
                key: `command.${command}.fail.${ after ? after : rt.failReason}`,
                variable: variable
            };
        }
        return rt;
    }

    damage(value, type = 'unknow', form = {}) {
        let r = this.link.player.damage(value, type, form);
        if (r.state == 'success') {
            return this.__messageConstructor('damage', r, { n: r.data.damage });
        } else {
            return this.__messageConstructor('damage', r);
        }
    }

    give(id, count = 1, data = {}) {
        let item = ItemGenerator.get(id);
        item.data = {...item.data, ...data};
        let r;
        if (item.features.stack || count == 1) {
            item.count = count;
            r = this.link.player.give(item);
        } else {
            let items = [item];
            for (let i = 1; i < count; i++) {
                let item2 = ItemGenerator.get(id);
                item2.data = {...item.data, ...data};
                items.push(item2);
            }
            r = this.link.player.giveItems(items);
        }

        if (r.state == 'success') {
            return this.__messageConstructor('give', r, { name: $t('item.' + id), n: count });
        } else {
            return this.__messageConstructor('give', r);
        }
    }

    kill() {
        return this.__messageConstructor(
            'kill',
            this.link.player.damage(Infinity, 'system')
        );
    }

    loottable(id) {
        let lt = new LootTable(
            id,
            {
                world:  this.link.world,
                room:   this.link.world.getSelectedRoom(),
                stage:  this.link.world.getSelectedRoom().getSelectedStage(),
                player: this.link.player,
                item:   this.link.player.getSelectedItem()
            }
        );

        let items = lt.getItem();
        let r = this.link.player.giveItems(items);

        if (r.state == 'success') {
            if (items.length == 0) {
                return this.__messageConstructor('loottable', r, { name: id }, 'no_item');
            } else {
                return this.__messageConstructor('loottable', r, { name: id }, 'ok');
            }
        } else {
            return this.__messageConstructor('loottable', r);
        }
    }

    regeneration(value) {
        let r = this.link.player.regeneration(value);
        if (r.state == 'success') {
            return this.__messageConstructor('regeneration', r, { n: r.data.rollback });
        } else {
            return this.__messageConstructor('regeneration', r);
        }
    }

    say(message) {
        this.link.messager.send(message);
        return { state: 'success', data: {} };
    }
}