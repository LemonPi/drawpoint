/**
 * Created by johnson on 11.05.17.
 */
const dp = require("../dist/drawpoint");
const assert = require("assert");
const deepCloseTo = require("deep-close-to");

function rand(minimum, maximum) {
    return Math.random() * (maximum - minimum + 1) + minimum;
}

function randInt(minimum, maximum) {
    return Math.floor(rand(minimum, maximum));
}

function toPaddedHexString(num, len) {
    const str = num.toString(16);
    return "0".repeat(len - str.length) + str;
}

const floatEpsilon = 0.000000000001;

function closeTo(actual, expected, delta = floatEpsilon) {
    return (Math.abs(actual - expected) < delta);
}

function assertCloseTo(actual, expected, delta = floatEpsilon) {
    if (Math.abs(actual - expected) > delta) {
        throw new assert.AssertionError({actual, expected, message: `${actual} close to ${expected} within ${delta}`});
    }
}
function assertDeepCloseTo(actual, expected, delta = floatEpsilon) {
    if (deepCloseTo(actual, expected, {comp: (a, b) => closeTo(a, b, delta)}) === false) {
        throw new assert.AssertionError({actual, expected, message: `close to within ${delta}`});
    }
}


function getRandomPoints(numberOfPoints = 10, minCoord = -100, maxCoord = 100) {
    const points = [];
    for (let i = 0; i < numberOfPoints; ++i) {
        points.push(dp.point(randInt(minCoord, maxCoord), randInt(minCoord, maxCoord)));
    }
    return points;
}

function getRandomPoint() {
    return getRandomPoints(1, ...arguments)[0];
}

module.exports = {
    floatEpsilon,
    rand, randInt, toPaddedHexString, closeTo, assertCloseTo, assertDeepCloseTo, getRandomPoints, getRandomPoint
};