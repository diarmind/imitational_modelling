import {uniform} from "../common/generator.mjs";
import {time} from "../common/time.mjs";

import {rails} from "./rails.mjs";


export default function start() {
    const trainsToAGen = uniform('q', 35, 55);
    const trainsToBGen = uniform('w', 35, 55);

    time.addGenerator({gen: trainsToAGen, callback: rails.fromAToB});
    time.addGenerator({gen: trainsToBGen, callback: rails.fromBToA});

    let previousTime = 0;
    let integralACountWait = 0;
    let integralBCountWait = 0;

    const timeoutIt = () => {
        const timeDelta = time.time - previousTime;
        integralACountWait += rails.Aqueue.length * timeDelta;
        integralBCountWait += rails.Bqueue.length * timeDelta;
        previousTime = time.time;
        if (!time.tick()) {
            setTimeout(timeoutIt, 0);
        } else {
            console.log('AVERAGE TIME A WAIT: ', integralACountWait / rails.allACount);
            console.log('AVERAGE TIME B WAIT: ', integralBCountWait / rails.allBCount);
            console.log('all trains from A count: ', rails.allACount, 'all trains from B count: ', rails.allBCount);
        }
    };
    setTimeout(timeoutIt, 0);
}
