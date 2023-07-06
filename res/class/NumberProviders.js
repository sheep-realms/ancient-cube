class NumberProviders {
    constructor(type = 'constant', data = {}) {
        this.type = 'constant';
        this.data = {};

        this.create(type, data);
    }

    create(type, data) {
        this.type = type;
        if (typeof data == 'number') data = { value: data };
        this.data = data;
    }

    getValue(...initValue) {
        switch (this.type) {
            // 常数
            case 'constant':
                return this.data?.value;

            // 随机平均分布
            case 'uniform':
                return Math.round(Math.random() * (this.data?.max - this.data?.min) + this.data?.min);

            // 透镜
            case 'lens':
                if (this.data.input?.min == undefined) this.data.input.min = 0;
                if (this.data.output?.min == undefined) this.data.output.min = 0;
                let inputLength = this.data.input.max - this.data.input.min;
                let outputLength = this.data.output.max - this.data.output.min;
                let rate = outputLength / inputLength;
                let value = Math.round((initValue[0] - this.data.input.min) * rate + this.data.output.min);
                if (value > this.data.output.max) value = this.data.output.max;
                if (value < this.data.output.min) value = this.data.output.min;
                return value;
        
            default:
                return;
        }
    }
}