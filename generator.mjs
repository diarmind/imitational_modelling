import seedrandom from 'seedrandom';


function* u01(seed) {
    const random = seedrandom(seed);
    while (true) {
        yield random();
    }
}


function* uniform(seed, min, max) {
    const rand01gen = u01(seed);
    while (true) {
        const {value: rand} = rand01gen.next();
        yield rand * (max - min) + min;
    }
}


function* exponential(seed, mean) {
    const rand01gen = u01(seed);
    while (true) {
        const {value: rand} = rand01gen.next();
        yield -Math.log(rand) * mean;
    }
}

function* exponentialMin(seed, mean, min) {
    const randExpGen = exponential(seed, mean);
    while (true) {
        const {value: rand} = randExpGen.next();
        if (rand < min) {
            yield min;
        } else {
            yield rand;
        }
    }
}


export {u01, uniform, exponential, exponentialMin};
