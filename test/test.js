/**
 * Created by johnson on 10.05.17.
 */
const dp = require("../dist/drawpoint");
const assert = require("assert");
const seedrandom = require("seedrandom");

if (process && process.argv[3]) {
    seedrandom(process.argv[3], {global: true});
}

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

const floatEpsilon = 0.0000001;

function assertCloseTo(actual, expected, delta = floatEpsilon) {
    if (Math.abs(actual - expected) > delta) {
        throw new assert.AssertionError({actual, expected, message:`${actual} close to ${expected} within ${delta}`});
    }
}

function getRandomPoints(numberOfPoints = 10, minCoord = -100, maxCoord = 100) {
    const points = [];
    for (let i = 0; i < numberOfPoints; ++i) {
        points.push(dp.point(randInt(minCoord, maxCoord), randInt(minCoord, maxCoord)));
    }
    return points;
}

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
                const hex = "#" + toPaddedHexString(rgb.r, 2) + toPaddedHexString(rgb.g, 2) + toPaddedHexString(rgb.b, 2);
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
                assertCloseTo(dp.deg(dp.rad(deg)), deg);
            });
        });

        it("should get back original radians after deg", function () {
            rads.forEach((rad)=> {
                assertCloseTo(dp.rad(dp.deg(rad)), rad);
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
                assert.strictEqual(dp.clamp(number, -101, 101), number);
            });
        });

        it("should clamp to max when greater than max", function () {
            numbers.forEach((number)=> {
                assert.strictEqual(dp.clamp(number, -101, number - 1), number - 1);
            });
        });
        it("should clamp to min when less than min", function () {
            numbers.forEach((number)=> {
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
            assert.strictEqual(dp.roundToDec(-0.49, 0), 0);
            assert.strictEqual(dp.roundToDec(-0.49, 1), -0.5);
        });

        it("should leave number as is if rounding to more decimals than given", function () {
            assert.strictEqual(dp.roundToDec(0.124, 10), 0.124);
        });

        it("should round decimals rather than truncate them", function () {
            assert.strictEqual(dp.roundToDec(0.126, 2), 0.13);
        });
    });
});

describe("point", function () {
    describe("#point", function () {
        it("should create a simple point object", function () {
            const pt = dp.point(10, 5);
            assert.strictEqual(pt.x, 10);
            assert.strictEqual(pt.y, 5);
        });
    });
    describe("#averagePoint", function () {
        const p1 = dp.origin;
        const p2 = dp.point(100, 200);
        it("should return p1 if t=0", function () {
            assert.deepStrictEqual(dp.averagePoint(p1, p2, 0), p1);
        });
        it("should return p2 if t=1", function () {
            assert.deepStrictEqual(dp.averagePoint(p1, p2, 1), p2);
        });
    });

    describe("addVector", function () {
        const p1 = dp.point(50, 20);
        const p2 = dp.point(100, 200);
        it("should treat points as vectors relative to (0,0)", function () {
            const sum = dp.addVector(p1, p2);
            assert.strictEqual(sum.x, p2.x + p1.x);
            assert.strictEqual(sum.y, p2.y + p1.y);
        });
    });

    describe("#diff", function () {
        const p1 = dp.point(50, 20);
        const p2 = dp.point(100, 200);
        it("diff(p1,p2) should return vector p1 -> p2", function () {
            const d = dp.diff(p1, p2);
            assert.strictEqual(d.x, p2.x - p1.x);
            assert.strictEqual(d.y, p2.y - p1.y);
        });
        it("should return (0,0) when diffing against self", function () {
            const d = dp.diff(p1, p1);
            assert.strictEqual(d.x, 0);
            assert.strictEqual(d.y, 0);
        })
    });

    describe("#norm", function () {
        it("should return 0 when vector is (0,0)", function () {
            assert.strictEqual(dp.norm(dp.origin), 0);
        });
        it("should treat points as vectors coming from (0,0)", function () {
            const pt = dp.point(50, 20);
            assert.strictEqual(dp.norm(pt), Math.sqrt(pt.x * pt.x + pt.y * pt.y));
        });
    });

    describe("#scale", function () {
        const scaleBys = [2, 2.5, 1, 5, 0, -2];
        it("should scale relative to (0,0) when reference is unspecified", function () {
            const pt = dp.point(5, 10);
            scaleBys.forEach((scaleBy)=> {
                const scaledPt = dp.scale(pt, scaleBy);
                assert.strictEqual(scaledPt.x, pt.x * scaleBy);
                assert.strictEqual(scaledPt.y, pt.y * scaleBy);
            });
        });
        it("should be equivalent to adding the difference vector scaled relative to (0,0)", function () {
            const p1 = dp.point(55, 100);
            const p2 = dp.point(100, 200);
            const diff = dp.diff(p1, p2);
            scaleBys.forEach((scaleBy)=> {
                assert.deepStrictEqual(dp.scale(p2, scaleBy, p1), dp.addVector(p1, dp.scale(diff, scaleBy)));
            });
        })
    });

    describe("#getUnitVector", function () {
        it("should return NaN when (0,0) is the input vector", function () {
            const uv = dp.getUnitVector(dp.origin);
            assert(isNaN(uv.x));
            assert(isNaN(uv.y));
        });
        const points = [dp.point(5, 10), dp.point(-22, 2), dp.point(0, 100), dp.point(100, 0)];
        it("should return vectors with norm 1", function () {
            points.forEach((pt)=> {
                const uv = dp.getUnitVector(pt);
                assertCloseTo(dp.norm(uv), 1);
            });
        });
        it("should return vectors with the same x/y ratio", function () {
            points.forEach((pt)=> {
                const uv = dp.getUnitVector(pt);
                if (uv.y !== 0) {
                    assertCloseTo(uv.x / uv.y, pt.x / pt.y);
                }
            });
        });
    });

    describe("#getPerpendicularVector", function () {
        it("should return NaN when (0,0) is the input vector", function () {
            const uv = dp.getPerpendicularVector(dp.origin);
            assert(isNaN(uv.x));
            assert(isNaN(uv.y));
        });
        const points = [dp.point(5, 10), dp.point(-22, 2), dp.point(0, 100), dp.point(100, 0)];
        it("should return vectors with norm 1", function () {
            points.forEach((pt)=> {
                const uv = dp.getUnitVector(pt);
                assertCloseTo(dp.norm(uv), 1);
            });
        });
        it("should return perpendicular vectors (dot product with original = 0)", function () {
            points.forEach((pt)=> {
                const uv = dp.getPerpendicularVector(pt);
                assert.strictEqual(uv.x * pt.x + uv.y * pt.y, 0);
            });
        });
    });

    describe("#adjust", function () {
        const pt = dp.point(50, 10);
        pt.cp1 = dp.point(100, 20);
        pt.cp2 = dp.point(-20, 20);
        it("should not move the point when adjusting by 0,0", function () {
            const adjusted = dp.adjust(pt, 0, 0);
            assert.deepStrictEqual(adjusted, pt);
        });
        it("should move by the specified amount", function () {
            getRandomPoints().forEach((moveBy) => {
                const adjusted = dp.adjust(pt, moveBy.x, moveBy.y);
                assert.deepStrictEqual(adjusted.cp1, dp.addVector(pt.cp1, moveBy));
                assert.deepStrictEqual(adjusted.cp2, dp.addVector(pt.cp2, moveBy));
                assert.deepStrictEqual(adjusted.x, pt.x + moveBy.x);
                assert.deepStrictEqual(adjusted.y, pt.y + moveBy.y);
            });
        });
    });

    describe("#extractPoint", function () {
        it("should remove any control points", function () {
            const pt = dp.point(50, 10);
            pt.cp1 = dp.point(100, 20);
            pt.cp2 = dp.point(-20, 20);
            const extracted = dp.extractPoint(pt);
            assert(extracted.hasOwnProperty("cp1") === false);
            assert(extracted.hasOwnProperty("cp2") === false);
            assert.strictEqual(extracted.x, pt.x);
            assert.strictEqual(extracted.y, pt.y);
        });
    });

    describe("#reflect", function () {
        it("should reflect across y axis by default", function () {
            getRandomPoints().forEach((pt)=> {
                const reflected = dp.reflect(pt);
                assert.strictEqual(reflected.x, -pt.x);
                assert.strictEqual(reflected.y, pt.y);
            });
        });
        it("should reflect across x axis when given m = 0, b = 0", function() {
            getRandomPoints().forEach((pt)=> {
                const reflected = dp.reflect(pt, 0, 0);
                assert.strictEqual(reflected.x, pt.x);
                assert.strictEqual(reflected.y, -pt.y);
            })
        })
    });

    describe("#rotatePoints", function () {
        const points = getRandomPoints();
        it("should not rotate if given rad = 0", function () {
            const rotated = dp.clone(points);
            dp.rotatePoints(dp.origin, 0, ...rotated);
            assert.deepStrictEqual(rotated, points);
        });
        const rotatedBys = [0.1, 0.5, -0.5, 4, 20];
        it("should keep magnitude but add angle when rotating about origin", function() {
            rotatedBys.forEach((rotatedBy) => {
                const rotated = dp.clone(points);
                dp.rotatePoints(dp.origin, rotatedBy, ...rotated);

                rotated.forEach((rpt, i) => {
                    const pt = points[i];
                    assertCloseTo(dp.norm(rpt), dp.norm(pt));
                    assertCloseTo(dp.angle(rpt), dp.unwrapRad(dp.angle(pt) + rotatedBy));
                });
            });
        });
        it("should rotate the points' diffs relative to a pivot", function() {
            rotatedBys.forEach((rotatedBy) => {
                const rotated = dp.clone(points);
                const pivot = getRandomPoints(1)[0];
                dp.rotatePoints(pivot, rotatedBy, ...rotated);

                rotated.forEach((rpt, i) => {
                    const pt = points[i];
                    const rdiff = dp.diff(pivot, rpt);
                    const diff = dp.diff(pivot, pt);
                    assertCloseTo(dp.norm(rdiff), dp.norm(diff));
                    assertCloseTo(dp.angle(rdiff), dp.unwrapRad(dp.angle(diff) + rotatedBy));
                });
            });
        });
    });

    describe("#scalePoints", function() {
        const points = getRandomPoints();
        it("should not scale if given scaleBy = 1", function() {
            const scaled = dp.clone(points);
            dp.scalePoints(dp.origin, 1, ...scaled);
            assert.deepStrictEqual(scaled, points);
        });
        const scaledBys = [0.1, 0.5, 2, 10, -0.5];
        it("should multiple norm when scaling about origin", function() {
            scaledBys.forEach((scaledBy) => {
                const scaled = dp.clone(points);
                dp.scalePoints(dp.origin, scaledBy, ...scaled);

                scaled.forEach((spt, i) => {
                    const pt = points[i];
                    assertCloseTo(dp.norm(spt), dp.norm(pt) * Math.abs(scaledBy));
                });
            });
        });
        it("should keep angle when scaling about origin", function() {
            scaledBys.forEach((scaledBy) => {
                const scaled = dp.clone(points);
                dp.scalePoints(dp.origin, scaledBy, ...scaled);

                scaled.forEach((spt, i) => {
                    const pt = points[i];
                    // goes to the other side when scaling by negative
                    assertCloseTo(dp.angle(spt), dp.unwrapRad(dp.angle(pt) + ((scaledBy >= 0)? 0 : Math.PI)));
                });
            });
        });
        it("should scale diffs relative to center", function() {
            scaledBys.forEach((scaledBy) => {
                const scaled = dp.clone(points);
                const center = getRandomPoints(1)[0];
                dp.scalePoints(center, scaledBy, ...scaled);

                scaled.forEach((spt, i) => {
                    const pt = points[i];
                    const sdiff = dp.diff(center, spt);
                    const diff = dp.diff(center, pt);
                    assertCloseTo(dp.norm(sdiff), dp.norm(diff) * Math.abs(scaledBy));
                    assertCloseTo(dp.angle(sdiff), dp.unwrapRad(dp.angle(diff) + ((scaledBy >= 0)? 0 : Math.PI)));
                });
            });
        });
    });
});
