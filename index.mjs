import {time} from './time.mjs';
import {clientQueue} from "./queue.mjs";
import {CarTransact} from './car.mjs';
import {exponential, uniform} from './generator.mjs';

const xCoordGen = uniform('xcoord', 0, 100);
const yCoordGen = uniform('ycoord', 0, 100);
const carWay = async (carTransact) => {
    console.log('taking load');
    await carTransact.takeLoad();
    let {value: x} = xCoordGen.next();
    let {value: y} = yCoordGen.next();
    x = Math.ceil(x);
    y = Math.ceil(y);
    console.log(`go to client ${x}, ${y}`);
    await carTransact.goToClient({x: x, y: y});
    console.log('deliver loading');
    await carTransact.deliverLoad();
    console.log('go back');
    await carTransact.goBack();
};

const processNewOrder = async () => {
    console.log('start processing');
    await clientQueue.getCar();
    console.log('got car');
    const car = new CarTransact();
    await carWay(car);
    console.log('releasing');
    await clientQueue.releaseCar();
};

const generateNewOrder = exponential('order', 2 * 60);

time.addGenerator({gen: generateNewOrder, callback: processNewOrder});

let integralQueueLength = 0;
let previousTime = 0;
let integralCars = 0;

const timeoutIt = () => {
    integralQueueLength += (time.time - previousTime) * clientQueue.queue.length;
    integralCars += (time.time - previousTime) * clientQueue.carsInUse;
    previousTime = time.time;
    if (!time.tick()) {
        setTimeout(timeoutIt, 30);
    } else {
        console.log('AVERAGE QUEUE: ', integralQueueLength / time.time);
        console.log('MAX QUEUE: ', clientQueue.maxQueue);
        console.log('AVERAGE CARS IN USE: ', integralCars / time.time);
    }
};
setTimeout(timeoutIt, 30);
