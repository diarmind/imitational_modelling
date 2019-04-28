class ClientQueue {
    constructor() {
        this.maxCars = 200;
        this.carsInUse = 0;

        this.queue = [];

        this.getCar = this.getCar.bind(this);
        this.checkCarAvailability = this.checkCarAvailability.bind(this);
        this.releaseCar = this.releaseCar.bind(this);
    }

    async getCar() {
        await new Promise((resolve, reject) => {
            if (this.checkCarAvailability()) {
                this.carsInUse++;
                resolve();
                return;
            }
            this.queue.push(resolve);
        });
        return this;
    };

    checkCarAvailability() {
        return this.carsInUse < this.maxCars;
    };

    releaseCar() {
        this.carsInUse--;
        const client = this.queue.shift();
        client && client();
        return this;
    };
}

const clientQueue = new ClientQueue();
export {clientQueue};
