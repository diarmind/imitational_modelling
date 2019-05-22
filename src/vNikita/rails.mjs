import {time} from "../common/time.mjs";
import {uniform} from "../common/generator.mjs";


const acTimeGen = uniform('acTimeGen', 12, 18);
const cbTimeGen = uniform('cbTimeGen', 16, 24);

class Rails {
    constructor() {
        this.cTrainCount = 0;
        this.Aqueue = [];
        this.Bqueue = [];

        this.fromAc = [];
        this.fromCb = [];

        this.allACount = 0;
        this.allBCount = 0;

        this.acIsGoing = false;
        this.cbIsGoing = false;

        this.goAc = this.goAc.bind(this);
        this.goCb = this.goCb.bind(this);

        this.seizeAc = this.seizeAc.bind(this);
        this.releaseAc = this.releaseAc.bind(this);
        this.seizeCb = this.seizeCb.bind(this);
        this.releaseCb = this.releaseCb.bind(this);

        this.fromAToB = this.fromAToB.bind(this);
        this.fromBToA = this.fromBToA.bind(this);

        this.waitAcbReady = this.waitAcbReady.bind(this);
        this.waitBcaReady = this.waitBcaReady.bind(this);

        this.waitCanGoFromAc = this.waitCanGoFromAc.bind(this);
        this.waitCanGoFromCb = this.waitCanGoFromCb.bind(this);

        this.wrapWithWaiters = this.wrapWithWaiters.bind(this);
        this.checkWaitersForAc = this.checkWaitersForAc.bind(this);
        this.checkWaitersForCb = this.checkWaitersForCb.bind(this);
        this.checkWaiters = this.checkWaiters.bind(this);
    }

    seizeAc() {
        this.acIsGoing = true;
    }

    releaseAc() {
        this.acIsGoing = false;
        this.checkWaiters();
    }

    seizeCb() {
        this.cbIsGoing = true;
    }

    releaseCb() {
        this.cbIsGoing = false;
        this.checkWaiters();
    }

    async goAc() {
        this.seizeAc();

        const {value: travelTime} = acTimeGen.next();
        await new Promise((resolve, reject) => {
            time.subscribeOnDelta({delta: travelTime, callback: this.wrapWithWaiters(resolve)});
        });

        this.releaseAc();
    }

    async goCb() {
        this.seizeCb();

        const {value: travelTime} = cbTimeGen.next();
        await new Promise((resolve, reject) => {
            time.subscribeOnDelta({delta: travelTime, callback: this.wrapWithWaiters(resolve)});
        });

        this.releaseCb();
    }

    async fromAToB() {
        this.allACount++;
        console.log('A-B: wait ready');
        await this.waitAcbReady();
        console.log('A-B: go AC');
        await this.goAc();
        this.cTrainCount++;
        console.log('A-B: wait CB', this.cTrainCount);
        await this.waitCanGoFromCb();
        this.cTrainCount--;
        console.log('A-B: go CB');
        await this.goCb();
        console.log('A-B: done!');
    }

    async fromBToA() {
        this.allBCount++;
        console.log('B-A: wait ready');
        await this.waitBcaReady();
        console.log('B-A: go BC');
        await this.goCb();
        this.cTrainCount++;
        console.log('B-A: wait AB', this.cTrainCount);
        await this.waitCanGoFromAc();
        console.log('B-A: go AB');
        this.cTrainCount--;
        await this.goAc();
        console.log('B-A: done!');
    }

    async waitAcbReady() {
        if (!this.acIsGoing && this.cTrainCount === 0) {
            return;
        }
        await new Promise((resolve, reject) => {
            this.Aqueue.push(this.wrapWithWaiters(resolve));
        });
    }

    async waitBcaReady() {
        if (!this.cbIsGoing && this.cTrainCount === 0) {
            return;
        }
        await new Promise((resolve, reject) => {
            this.Bqueue.push(this.wrapWithWaiters(resolve));
        });
    }

    async waitCanGoFromAc() {
        if (!this.acIsGoing) {
            return;
        }
        await new Promise((resolve, reject) => {
            this.fromAc.push(this.wrapWithWaiters(resolve));
        });
    }

    async waitCanGoFromCb() {
        if (!this.cbIsGoing) {
            return;
        }
        await new Promise((resolve, reject) => {
            this.fromCb.push(this.wrapWithWaiters(resolve));
        })
    }

    wrapWithWaiters(func) {
        return () => {
            func();
            this.checkWaiters();
        }
    }

    checkWaitersForAc() {
        if (!this.acIsGoing && this.fromAc.length > 0) {
            const resolve = this.fromAc.shift();
            resolve();
        }
    }

    checkWaitersForCb() {
        if (!this.cbIsGoing && this.fromCb.length > 0) {
            const resolve = this.fromCb.shift();
            resolve();
        }
    }

    checkWaiters() {
        this.checkWaitersForAc();
        this.checkWaitersForCb();

        if (this.cTrainCount === 0 && !this.acIsGoing && this.Aqueue.length > 0) {
            const resolve = this.Aqueue.shift();
            resolve();
        }
        if (this.cTrainCount === 0 && !this.cbIsGoing && this.Bqueue.length > 0) {
            const resolve = this.Bqueue.shift();
            resolve();
        }
    }
}

const rails = new Rails();

export {rails};
