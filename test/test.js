/**
 * Created by johnson on 10.05.17.
 */
const dp = require("../dist/drawpoint");
const assert = require("assert");

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

function closeTo(actual, expected, delta) {
    return Math.abs(actual - expected) < delta;
}

const floatEpsilon = 0.0000001;

describe("Draw points", function () {
    describe("color", function () {
        const colors = [];
        for (let r = 0, g = 100, b = 50, i = 0; i < 10; ++i) {
            r += randInt(0, 40);
            g += randInt(0, 40);
            b += randInt(0, 40);
            r %= 255;
            g %= 255;
            b %= 255;
            colors.push({r, g, b});
        }

        describe("#extractRGB", function () {
            it("should correctly extract RGB values from strings", function () {
                colors.forEach((color) => {
                    assert.deepEqual(dp.extractRGB(`rgb(${color.r}, ${color.g}, ${color.b})`), color);
                });
            });
        });

        describe("#RGBToHSL, HSLToRGB", function () {
            it("should give back original RGB values if both are applied", function () {
                colors.forEach((rgb) => {
                    assert.deepEqual(dp.HSLToRGB(dp.RGBToHSL(rgb)), rgb);
                });
            });
        });

        describe("#extractHex", function () {
            it("should correctly extract RGB values from hex string", function () {
                colors.forEach((rgb) => {
                    const hex = "#" + toPaddedHexString(rgb.r, 2) + toPaddedHexString(rgb.g, 2) + toPaddedHexString(rgb.b, 2);
                    assert.deepEqual(dp.extractHex(hex), rgb);
                });
            });
        });

        describe("#adjustColor", function () {
            it("should return identity when given no adjustment object", function () {
                colors.forEach((rgb) => {
                    const hsl = dp.RGBToHSL(rgb);
                    assert.notEqual(hsl, null);
                    const adjusted = dp.adjustColor(rgb, {});
                    assert.notEqual(adjusted, null);
                    assert.deepEqual(dp.extractHSL(adjusted), hsl);
                });
            });
        });
    });

    describe("numeric", function () {
        describe("#deg, #rad", function () {
            const degs = [];
            const rads = [];
            for (let i = 0; i < 10; ++i) {
                degs.push(randInt(-720, 720));
                rads.push(rand(-10, 10));
            }

            it("should get back original degrees after rad", function () {
                degs.forEach((deg)=> {
                    assert(closeTo(dp.deg(dp.rad(deg)), deg, floatEpsilon));
                });
            });

            it("should get back original radians after deg", function () {
                rads.forEach((rad)=> {
                    assert(closeTo(dp.rad(dp.deg(rad)), rad, floatEpsilon));
                });
            });
        });

        describe("#clamp", function () {
            const numbers = [];
            for (let i = 0; i < 10; ++i) {
                numbers.push(randInt(-100, 100));
            }
            it("should not do anything when inside bounds", function () {
                numbers.forEach((number)=> {
                    assert.equal(dp.clamp(number, -101, 101), number);
                });
            });

            it("should clamp to max when greater than max", function () {
                numbers.forEach((number)=> {
                    assert.equal(dp.clamp(number, -101, number - 1), number - 1);
                });
            });
            it("should clamp to min when less than min", function () {
                numbers.forEach((number)=> {
                    assert.equal(dp.clamp(number, number + 1, 101), number + 1);
                });
            });
        });

        describe("#roundToDec", function() {
            it("should round to integer with 0 or unspecified decimal places", function () {
               assert.equal(dp.roundToDec(0.23, 0), 0);
                assert.equal(dp.roundToDec(1.1),1);
            });

            it("should round negative numbers towards 0", function() {
                assert.equal(dp.roundToDec(-0.49, 0), 0);
                assert.equal(dp.roundToDec(-0.49, 1), -0.5);
            });

            it("should leave number as is if rounding to more decimals than given", function() {
                assert.equal(dp.roundToDec(0.124, 10), 0.124);
            });

            it("should round decimals rather than truncate them", function() {
                assert.equal(dp.roundToDec(0.126, 2), 0.13);
            });
        });
    });
    
});