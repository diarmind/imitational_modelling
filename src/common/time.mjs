class Time {
    constructor() {
        this.time = 0;
        this.subscribers = {};
        this.maxSimulationTime = 60 * 24;

        this.addGenerator = this.addGenerator.bind(this);
        this.subscribeOnDelta = this.subscribeOnDelta.bind(this);
        this.tick = this.tick.bind(this);
    }

    addGenerator({gen, callback}) {
        const planEventDecorator = (func) => {
            return (...args) => {
                const {value: delta} = gen.next();
                if (delta >= 0) {
                    this.subscribeOnDelta({callback: planEventDecorator(func), delta: delta});
                }
                func(...args);
            };
        };

        const {value: delta} = gen.next();
        if (delta >= 0) {
            this.subscribeOnDelta({callback: planEventDecorator(callback), delta: delta});
        }

        return this;
    };

    subscribeOnDelta({callback, delta}) {
        const absoluteTime = this.time + delta;
        this.subscribers[absoluteTime] = this.subscribers[absoluteTime] || [];
        this.subscribers[absoluteTime].push(callback);

        return this;
    };

    tick() {
        const minNextTime = Math.min(...[...Object.keys(this.subscribers)].map(i => Number(i)));
        if (!minNextTime) {
            throw Error('Nothing to simulate');
        }
        if (minNextTime > this.maxSimulationTime) {
            return 1;
        }
        this.time = minNextTime;
        console.log(minNextTime);
        while (this.subscribers[minNextTime].length > 0) {
            const callback = this.subscribers[minNextTime].pop();
            callback();
        }
        delete this.subscribers[minNextTime];
        return 0;
    };
}

const time = new Time();

export {time};
