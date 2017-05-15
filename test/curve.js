const dp = require("../dist/drawpoint");
// const dp = require("../src/index");
const assert = require("assert");
const c = require("./common");

function getRandomCurves() {
    const pLine = c.getRandomPoint();
    const pQuadratic = c.getRandomPoint();
    pQuadratic.cp1 = c.getRandomPoint();
    const pCubic = c.getRandomPoint();
    pCubic.cp1 = c.getRandomPoint();
    pCubic.cp2 = c.getRandomPoint();

    return [pLine, pQuadratic, pCubic];
}

const p1 = c.getRandomPoint();
describe("#applyToCurve", function () {
    const [pLine, pQuadratic, pCubic] = getRandomCurves();
    it("should detect lines", function () {
        let ok = false;
        dp.applyToCurve(p1, pLine, {
            linear: (pp1, p2) => {
                assert.deepStrictEqual(pp1, p1);
                assert.deepStrictEqual(p2, pLine);
                ok = true;
            },
            quadratic: () => {
                assert.fail(0, 0, "linear treated as quadratic");
            },
            cubic: () => {
                assert.fail(0, 0, "linear treated as cubic");
            },
        });
        assert.ok(ok);
    });
    it("should detect quadratic curves", function () {
        let ok = false;
        dp.applyToCurve(p1, pQuadratic, {
            linear: () => {
                assert.fail(0, 0, "quadratic treated as linear");
            },
            quadratic: (pp1, cp, p2) => {
                assert.deepStrictEqual(pp1, p1);
                assert.deepStrictEqual(p2, dp.extractPoint(pQuadratic));
                assert.deepStrictEqual(cp, pQuadratic.cp1);
                ok = true;
            },
            cubic: () => {
                assert.fail(0, 0, "quadratic treated as cubic");
            },
        });
        assert.ok(ok);
    });
    it("should detect cubic curves", function () {
        let ok = false;
        dp.applyToCurve(p1, pCubic, {
            linear: () => {
                assert.fail(0, 0, "cubic treated as linear");
            },
            quadratic: () => {
                assert.fail(0, 0, "cubic treated as quadratic");
            },
            cubic: (pp1, cp1, cp2, p2) => {
                assert.deepStrictEqual(pp1, p1);
                assert.deepStrictEqual(p2, dp.extractPoint(pCubic));
                assert.deepStrictEqual(cp1, pCubic.cp1);
                assert.deepStrictEqual(cp2, pCubic.cp2);
                ok = true;
            },
        });
        assert.ok(ok);
    });
});

describe("#getPointOnCurve", function () {
    const [pLine, pQuadratic, pCubic] = getRandomCurves();
    const curves = [pLine, pQuadratic, pCubic];
    const ts = [0.1, 0.5, -0.1, 0.7, 1.1];
    it("should give start point when t = 0", function () {
        curves.forEach((p2) => {
            const pt = dp.getPointOnCurve(0, p1, p2);
            assert.deepEqual(pt, p1);
        });
    });
    it("should give end point when t = 1", function () {
        curves.forEach((p2) => {
            const pt = dp.getPointOnCurve(1, p1, p2);
            assert.deepEqual(pt, dp.extractPoint(p2));
        });
    });
    it("should split lines correctly", function () {
        ts.forEach((t) => {
            const pt = dp.getPointOnCurve(t, p1, pLine);
            c.assertCloseTo(pt.x, p1.x * (1 - t) + pLine.x * t);
            c.assertCloseTo(pt.y, p1.y * (1 - t) + pLine.y * t);
        });
    });
    it("should treat curves with control points along the curve like lines", function () {
        // a quadratic with a control point along the linear (equivalent to a linear)
        const pLineQuadratic = dp.elevateDegree(p1, pLine);
        const pLineCubic = dp.elevateDegree(p1, pLineQuadratic);
        // a cubic with control points along the linear (equivalent to a linear)

        ts.forEach((t) => {
            const pt = dp.getPointOnCurve(t, p1, pLine);
            c.assertDeepCloseTo(dp.getPointOnCurve(t, p1, pLineQuadratic), pt);
            c.assertDeepCloseTo(dp.getPointOnCurve(t, p1, pLineCubic), pt);
        });
    });
});

describe("#elevateDegree", function () {
    const [pLine, pQuadratic] = getRandomCurves();
    const ts = [0.1, 0.5, -0.1, 0.7, 1.1];
    it("should increase the degree but return the same points per t for linear", function () {
        const pLineQuadratic = dp.elevateDegree(p1, pLine);
        const pLineCubic = dp.elevateDegree(p1, pLineQuadratic);
        assert.deepStrictEqual(dp.extractPoint(pLineQuadratic), pLine);

        ts.forEach((t) => {
            const pt = dp.getPointOnCurve(t, p1, pLine);
            c.assertDeepCloseTo(dp.getPointOnCurve(t, p1, pLineQuadratic), pt);
            c.assertDeepCloseTo(dp.getPointOnCurve(t, p1, pLineCubic), pt);
        });
    });
    it("should increase the degree but return the same points per t for quadratic", function () {
        const pQuadraticCubic = dp.elevateDegree(p1, pQuadratic);
        assert.deepStrictEqual(dp.extractPoint(pQuadraticCubic), dp.extractPoint(pQuadratic));

        ts.forEach((t) => {
            const pt = dp.getPointOnCurve(t, p1, pQuadratic);
            c.assertDeepCloseTo(dp.getPointOnCurve(t, p1, pQuadraticCubic), pt);
        });
    });
});

describe("#splitCurve", function () {
    const curves = getRandomCurves();
    it("should always start and end at original points (left.p1 == p1 && right.p2 == p2)", function () {
        curves.forEach((p2) => {
            // t can be anything, not necessarily confined to [0,1]
            // but just that when it's outside [0,1] it won't be on the curve
            const sp = dp.splitCurve(c.rand(-10, 10), p1, p2);
            assert.deepStrictEqual(sp.left.p1, p1);
            assert.deepStrictEqual(sp.right.p2, dp.extractPoint(p2));
        });
    });
    it("should always share the splitting point (left.p2 = right.p1)", function () {
        curves.forEach((p2) => {
            // t can be anything, not necessarily confined to [0,1]
            // but just that when it's outside [0,1] it won't be on the curve
            const sp = dp.splitCurve(c.rand(-10, 10), p1, p2);
            assert.deepStrictEqual(sp.left.p2, sp.right.p1);
        });
    });
    it("should give back start point when t=0", function () {
        curves.forEach((p2) => {
            const sp = dp.splitCurve(0, p1, p2);

            // after splitting the control points are attached to the left and right curves rather than the end points
            if (p2.cp1) {
                sp.right.p2.cp1 = sp.right.cp1;
            }
            if (p2.cp2) {
                sp.right.p2.cp2 = sp.right.cp2;
            }

            assert.deepStrictEqual(sp.left.p1, p1);
            assert.deepStrictEqual(sp.left.p2, p1);
            assert.deepStrictEqual(sp.right.p1, p1);
            assert.deepStrictEqual(sp.right.p2, p2);
        });
    });
    it("should give back end point when t=1", function () {
        curves.forEach((p2) => {
            const sp = dp.splitCurve(1, p1, p2);

            // after splitting the control points are attached to the left and right curves rather than the end points
            if (sp.left.cp1) {
                sp.left.p2.cp1 = sp.left.cp1;
            }
            if (sp.left.cp2) {
                sp.left.p2.cp2 = sp.left.cp2;
            }

            assert.deepStrictEqual(sp.left.p1, p1);
            assert.deepStrictEqual(sp.left.p2, p2);
            assert.deepStrictEqual(sp.right.p1, p2);
            const extractedP2 = dp.extractPoint(p2);
            assert.deepStrictEqual(sp.right.p2, extractedP2);
            if (p2.cp1) {
                assert.deepStrictEqual(sp.right.cp1, extractedP2);
            }
            if (p2.cp2) {
                assert.deepStrictEqual(sp.right.cp2, extractedP2);
            }
        });
    });

    const tSplits = [0.2, 0.4, 0.6, 0.8];
    const tSteps = [0.01, 0.05, 0.1, 0.19, 0.25, 0.39, 0.5, 0.7, 0.9];
    curves.forEach((p2, degree) => {
        it("should give back the original curve for degree " + (degree + 1), function () {
            tSplits.forEach((tSplit) => {

                const sp = dp.splitCurve(tSplit, p1, p2);
                sp.left.p2.cp1 = sp.left.cp1;
                sp.left.p2.cp2 = sp.left.cp2;
                sp.right.p2.cp1 = sp.right.cp1;
                sp.right.p2.cp2 = sp.right.cp2;

                tSteps.forEach((t) => {
                    // expected point
                    const expectedPt = dp.getPointOnCurve(t, p1, p2);
                    let actualPt;
                    // would be on the left side
                    if (t < tSplit) {
                        actualPt = dp.getPointOnCurve(t / tSplit, sp.left.p1, sp.left.p2);
                    } else {
                        actualPt = dp.getPointOnCurve((t - tSplit) / (1 - tSplit), sp.right.p1, sp.right.p2);
                    }

                    c.assertDeepCloseTo(actualPt, expectedPt);
                });
            });
        });
    });

});

describe("#interpolateCurve", function () {
    const [pLine, pQuadratic, pCubic] = getRandomCurves();
});

describe("#simpleQuadratic", function () {

});

describe("#getCubicControlPoints", function () {

});

describe("#transformCurve", function () {

});
