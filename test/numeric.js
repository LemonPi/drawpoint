const dp = require("../dist/drawpoint");
const assert = require("assert");
const c = require("./common");

describe("#deg, #rad", function () {
    const degs = [];
    const rads = [];
    for (let i = 0; i < 10; ++i) {
        degs.push(c.randInt(-720, 720));
        rads.push(c.rand(-10, 10));
    }

    it("should get back original degrees after rad", function () {
        degs.forEach((deg) => {
            c.assertCloseTo(dp.deg(dp.rad(deg)), deg);
        });
    });

    it("should get back original radians after deg", function () {
        rads.forEach((rad) => {
            c.assertCloseTo(dp.rad(dp.deg(rad)), rad);
        });
    });
});

describe("#clamp", function () {
    const numbers = [];
    for (let i = 0; i < 10; ++i) {
        numbers.push(c.randInt(-100, 100));
    }
    it("should not do anything when inside bounds", function () {
        numbers.forEach((number) => {
            assert.strictEqual(dp.clamp(number, -101, 101), number);
        });
    });

    it("should clamp to max when greater than max", function () {
        numbers.forEach((number) => {
            assert.strictEqual(dp.clamp(number, -101, number - 1), number - 1);
        });
    });
    it("should clamp to min when less than min", function () {
        numbers.forEach((number) => {
            assert.strictEqual(dp.clamp(number, number + 1, 101), number + 1);
        });
    });
});

describe("#roundToDec", function () {
    it("should round to integer with 0 or unspecified decimal places", function () {
        assert.strictEqual(dp.roundToDec(0.23, 0), 0);
        assert.strictEqual(dp.roundToDec(1.1), 1);
    });

    it("should round negative numbers towards 0", function () {
        assert.strictEqual(dp.roundToDec(-0.49, 0), -0);
        assert.strictEqual(dp.roundToDec(-0.49, 1), -0.5);
    });

    it("should leave number as is if rounding to more decimals than given", function () {
        assert.strictEqual(dp.roundToDec(0.124, 10), 0.124);
    });

    it("should round decimals rather than truncate them", function () {
        assert.strictEqual(dp.roundToDec(0.126, 2), 0.13);
    });
});
