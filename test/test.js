/**
 * Created by johnson on 10.05.17.
 */
const dp = require("../dist/drawpoint");
const assert = require("assert");

function randInt(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function toPaddedHexString(num, len) {
    const str = num.toString(16);
    return "0".repeat(len - str.length) + str;
}

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
        
        describe("#adjustColor", function() {
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
});