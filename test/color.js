/**
 * Created by johnson on 11.05.17.
 */
const dp = require("../dist/drawpoint");
const assert = require("assert");
const c = require("./common");

const colors = [];
for (let r = 0, g = 100, b = 50, i = 0; i < 10; ++i) {
    r += c.randInt(0, 40);
    g += c.randInt(0, 40);
    b += c.randInt(0, 40);
    r %= 255;
    g %= 255;
    b %= 255;
    colors.push({r, g, b});
}

describe("#extractRGB", function () {
    it("should correctly extract RGB values from strings", function () {
        colors.forEach((color) => {
            assert.deepStrictEqual(dp.extractRGB(`rgb(${color.r}, ${color.g}, ${color.b})`), color);
        });
    });
});

describe("#RGBToHSL, HSLToRGB", function () {
    it("should give back original RGB values if both are applied", function () {
        colors.forEach((rgb) => {
            assert.deepStrictEqual(dp.HSLToRGB(dp.RGBToHSL(rgb)), rgb);
        });
    });
});

describe("#extractHex", function () {
    it("should correctly extract RGB values from hex string", function () {
        colors.forEach((rgb) => {
            const hex = "#" + c.toPaddedHexString(rgb.r, 2) + c.toPaddedHexString(rgb.g, 2) + c.toPaddedHexString(rgb.b, 2);
            assert.deepStrictEqual(dp.extractHex(hex), rgb);
        });
    });
});

describe("#adjustColor", function () {
    it("should return identity when given no adjustment object", function () {
        colors.forEach((rgb) => {
            const hsl = dp.RGBToHSL(rgb);
            assert.notStrictEqual(hsl, null);
            const adjusted = dp.adjustColor(rgb, {});
            assert.notStrictEqual(adjusted, null);
            assert.deepStrictEqual(dp.extractHSL(adjusted), hsl);
        });
    });
});
