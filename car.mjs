import {time} from "./time.mjs";
import {uniform, exponentialMin} from "./generator.mjs";


const takeLoadTimeGen = uniform('load', 8 * 60, 12 * 60);
const deliverLoadTimeGen = uniform('deliver', 8 * 60, 12 * 60);
const goToClientTimeGen = exponentialMin('clientTime', 5 * 60, 2 * 60);

class CarTransact {
    constructor() {
        this.position = {x: 0, y: 0};
        this.currentPosition = {...this.position};

        this.takeLoad = this.takeLoad.bind(this);
        this.goToClient = this.goToClient.bind(this);
        this.deliverLoad = this.deliverLoad.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    async takeLoad() {
        const {value: loadTime} = takeLoadTimeGen.next();
        await new Promise((resolve, reject) => {
            time.subscribeOnDelta({callback: resolve, delta: loadTime});
        });

        return this;
    };

    async goToClient({x, y}) {
        const distanceX = (Math.abs(x - this.position.x) || 1) - 1;
        const distanceY = (Math.abs(y - this.position.y) || 1) - 1;
        const distance = distanceX + distanceY;
        let goToClientTime = 0;
        for (let i = 0; i < distance; i++) {
            goToClientTime += goToClientTimeGen.next().value;
        }

        await new Promise((resolve, reject) => {
            time.subscribeOnDelta({callback: resolve, delta: goToClientTime});
        });
        this.currentPosition = {x: x, y: y};

        return this;
    };

    async deliverLoad() {
        const {value: deliverLoadTime} = deliverLoadTimeGen.next();

        await new Promise((resolve, reject) => {
            time.subscribeOnDelta({callback: resolve, delta: deliverLoadTime});
        });
        return this;
    };

    async goBack() {
        const distanceX = (Math.abs(this.currentPosition.x - this.position.x) || 1) - 1;
        const distanceY = (Math.abs(this.currentPosition.y - this.position.y) || 1) - 1;
        const distance = distanceY + distanceX;
        let goBackTime = 0;
        for (let i = 0; i < distance; i++) {
            goBackTime += goToClientTimeGen.next().value;
        }

        await new Promise((resolve, reject) => {
            time.subscribeOnDelta({callback: resolve, delta: goBackTime});
        });

        return this;
    };
}

export {CarTransact};
