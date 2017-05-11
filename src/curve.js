/**
 * Created by johnson on 11.05.17.
 */

import {extractPoint, diff, getPerpendicularVector, averagePoint} from "./point";

function splitBezier(points, t) {
    // split a cubic bezier based on De Casteljau, t is between [0,1]
    const A = points.p1, B = points.cp1, C = points.cp2, D = points.p2;
    const E = {
        x: A.x * (1 - t) + B.x * t,
        y: A.y * (1 - t) + B.y * t
    };
    const F = {
        x: B.x * (1 - t) + C.x * t,
        y: B.y * (1 - t) + C.y * t
    };
    const G = {
        x: C.x * (1 - t) + D.x * t,
        y: C.y * (1 - t) + D.y * t
    };
    const H = {
        x: E.x * (1 - t) + F.x * t,
        y: E.y * (1 - t) + F.y * t
    };
    const J = {
        x: F.x * (1 - t) + G.x * t,
        y: F.y * (1 - t) + G.y * t
    };
    const K = {
        x: H.x * (1 - t) + J.x * t,
        y: H.y * (1 - t) + J.y * t
    };
    return {
        left : {
            p1 : A,
            cp1: E,
            cp2: H,
            p2 : K
        },
        right: {
            p1 : K,
            cp1: J,
            cp2: G,
            p2 : D
        }
    };
}

function splitQuadratic(points, t) {
    // split a quadratic bezier based on De Casteljau, t is between [0,1]
    const A = points.p1, B = points.cp1, C = points.p2;
    const D = {
        x: A.x * (1 - t) + B.x * t,
        y: A.y * (1 - t) + B.y * t
    };
    const E = {
        x: B.x * (1 - t) + C.x * t,
        y: B.y * (1 - t) + C.y * t
    };
    const F = {
        x: D.x * (1 - t) + E.x * t,
        y: D.y * (1 - t) + E.y * t
    };

    return {
        left : {
            p1 : A,
            cp1: D,
            p2 : F
        },
        right: {
            p1 : F,
            cp1: E,
            p2 : C
        }
    };
}

function splitLinear(points, t) {
    // split a linear line
    const A = points.p1, B = points.p2;
    const C = {
        x: A.x * (1 - t) + B.x * t,
        y: A.y * (1 - t) + B.y * t
    };
    return {
        left : {
            p1: A,
            p2: C
        },
        right: {
            p1: C,
            p2: B
        }
    };
}

/**
 * Split the curve between two drawpoints and return all the resulting drawpoints
 * @memberof module:da
 * @param {object} p1 Starting drawpoint
 * @param {object} p2 Ending drawpoint and also where we look at the control points
 * @param {number} t "time" along the curve to split at. Since all curves are parameterized
 * curves, t is their parameter. Can be thought of as traversing along the curve, where 0 is
 * at the start point and 1 is at the end point. This value can go beyond [0,1].
 * @returns {{left, right}} Object having a left and right property, each with their own
 * p1 (start point), p2 (end point), and optionally cp1 and cp2 depending on what kind of
 * curve was split. Note that sp.left.p2 === sp.right.p1 always in value.
 */
export function splitCurve(p1, p2, t) {
    // split either a quadratic or bezier curve depending on number of control points on
    // the end point
    if (p2.cp1 && p2.cp2) {
        return splitBezier({
            p1 : extractPoint(p1),
            p2 : extractPoint(p2),
            cp1: p2.cp1,
            cp2: p2.cp2
        }, t);
    }
    const cp = p2.cp1 || p2.cp2;
    if (cp) {
        return splitQuadratic({
            p1 : extractPoint(p1),
            p2 : extractPoint(p2),
            cp1: cp
        }, t);
    } else {
        return splitLinear({
            p1: extractPoint(p1),
            p2: p2
        }, t);
    }
}

function interpolateLinear(p1, p2, p) {
    // looking for y given x
    // vertical line, can't calculate
    if (p2 == p1) {
        console.log("Linear interpolation vertical line");
        return p;
    }
    const t = (p - p1) / (p2 - p1);
    return [t * (p2 - p1) + p1, t];
}

function solveQuadraticEquation(a, b, c) {

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return [];

    } else {
        return [
            (-b + Math.sqrt(discriminant)) / (2 * a),
            (-b - Math.sqrt(discriminant)) / (2 * a)
        ];
    }
}

function interpolateQuadratic(p1, p2, cp1, p) {
    const a = (p1 - 2 * cp1 + p2);
    const b = 2 * (cp1 - p1);
    const c = p1 - p;

    // 2 possible values for t
    const ts = solveQuadraticEquation(a, b, c);
    if (ts.length === 0) {
        console.log("Quadratic interpolation out of bounds");
        return null;
    }

    let t = ts[0];
    if (ts.length === 2) {
        if (t < 0 || t > 1) {
            t = ts[1];
        }
    }

    // t outside of 0 or 1 means something's wrong
    if (t < 0 || t > 1) {
        console.log("Quadratic interpolation out of bounds");
    }

    return [
        (p1 - 2 * cp1 + p1) * t * t + 2 * (cp1 - p1) * t + p1,
        t
    ];
}

function cubeRoot(v) {
    if (v < 0) {
        return -Math.pow(-v, 1 / 3);
    } else {
        return Math.pow(v, 1 / 3);
    }
}

/**
 * Solve a cubic equation of the form x^3 + a * x^2 + b * x + c = 0 for x
 * Uses Cardano's equation
 * See https://trans4mind.com/personal_development/mathematics/polynomials/cubicAlgebra.htm
 * @param a
 * @param b
 * @param c
 * @returns {*}
 */
function solveCubicEquation(a, b, c) {

    const a3 = a / 3;
    // reduce to t^3 + p * t + q = 0 form
    // always reducible by substituting x = t - a / 3
    const p = (3 * b - a * a) / 3;
    const p3 = p / 3;
    const q = (2 * a * a * a - 9 * a * b + 27 * c) / 27;
    const q2 = q / 2;

    // further transformation into (u - v)^3 + 3uv(u - v) = u^3 - v^3
    // with substitutions p = 3uv, -q = u^3 - v^3, t = u - v
    // v = p/(3u) substituted into
    // u^3 - v^3 = -q gives
    // u^3 + q - (p/(3u))^3 = 0 multiply by u^3
    // u^6 + qu^3 - (p/3)^3 = 0 quadratic in u^3
    // u^3 = (-q +- sqrt(q^3 + 4(p/3)^3)) / 2 simplified to
    // u^3 = -q/2 +- sqrt((q/2)^2 + (p/3)^3) get v^3 from u^3 - v^3 = -q
    // v^3 = q/2  +- sqrt((q/2)^2 + (p/3)^3)
    // and determine the discriminant:
    const discriminant = roundToDecimal(q2 * q2 + p3 * p3 * p3, 8);

    // 1 real root
    if (discriminant > 0) {
        const sqrtDiscriminant = Math.sqrt(discriminant);
        const u = cubeRoot(-q2 + sqrtDiscriminant);
        const v = cubeRoot(q2 + sqrtDiscriminant);
        const x1 = u - v - a3;
        // ignore other imaginary roots
        return [x1];
    }

    // all roots real (3 in total, 1 single and 1 double)
    if (discriminant === 0) {
        // v = -u
        const u = cubeRoot(-q2);
        // t = u - v, x = t - a/3 = u - v - a/3 = 2u - a/3
        const x1 = 2 * u - a3;
        // conjugate roots produce 1 double root
        const x2 = -u - a3;
        return [x1, x2];
    }

    // all roots are real and different (unpleasant imaginary discriminant)
    // first represent in polar form (a + bi) = r(cos(phi) + i*sin(phi))
    // factoring out i = sqrt(-1)
    // u^3 = -q/2 + i*sqrt(-discriminant)
    // v^3 = q/2  + i*sqrt(-discriminant)
    // for u^3, a = -q/2, b = sqrt(-discriminant)
    // r^2 = a^2 + b^2 = (-q/2)^2 - discriminant
    // r^2 = (q/2)^2 - ((q/2)^2 + (p/3)^3) = -(p/3)^3
    const r = Math.sqrt(-p3 * p3 * p3);
    // cos(phi) = a/r (triangle with a along Re, b along Im and r hypotenuse)
    let cosphi = -q2 / r;
    // correct for float rounding
    if (cosphi < -1) {
        cosphi = -1;
    } else if (cosphi > 1) {
        cosphi = 1;
    }
    const phi = Math.acos(cosphi);
    // de Moivre's law -> [r(cos(phi) + i*sin(phi)]^n = r^n * (cos(phi/n) + i*sin(phi/n))
    // values below easy to see if seen as vectors in complex plane
    // u = r^(1/3) * (cos(phi/3)  + i*sin(phi/3))
    // v = r^(1/3) * (-cos(phi/3) + i*sin(phi/3))
    // x = u - v - a/3
    // imaginary parts cancel out
    const commonPrefix = 2 * cubeRoot(r);
    const x1 = commonPrefix * Math.cos(phi / 3) - a3;
    const x2 = commonPrefix * Math.cos((phi + 2 * Math.PI) / 3) - a3;
    const x3 = commonPrefix * Math.cos((phi + 4 * Math.PI) / 3) - a3;
    return [x1, x2, x3];
}

function roundToDecimal(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

function interpolateCubic(p0, p1, p2, p3, p) {
    // and rewrite from [a(1-t)^3 + 3bt(1-t)^2 + 3c(1-t)t^2 + dt^3] form
    p0 -= p;
    p1 -= p;
    p2 -= p;
    p3 -= p;

    // to [t^3 + at^2 + bt + c] form:
    const d = -p0 + 3 * p1 - 3 * p2 + p3;
    const a = (3 * p0 - 6 * p1 + 3 * p2 ) / d;
    const b = (-3 * p0 + 3 * p1) / d;
    const c = p0 / d;

    const roots = solveCubicEquation(a, b, c);

    const ts = [];
    let root;
    for (let i = 0; i < roots.length; i++) {
        root = roundToDecimal(roots[i], 15);
        if (root >= 0 && root <= 1) {
            ts.push(root);
        }
    }

    return ts;
}

function getCubicValue(t, a, b, c, d) {
    return a * (1 - t) * (1 - t) * (1 - t) + 3 * b * (1 - t) * (1 - t) * t +
        3 * c * (1 - t) * t * t + d * t * t * t;
}

export function interpolateCurve(p1, p2, betweenPoint) {
    let v, t;
    if (p2.cp2) {
        if (betweenPoint.x === null) {
            [t] = interpolateCubic(p1.y, p2.cp1.y, p2.cp2.y, p2.y, betweenPoint.y);
            betweenPoint.x = getCubicValue(t, p1.x, p2.cp1.x, p2.cp2.x, p2.x);
        } else if (betweenPoint.y === null) {
            [t] = interpolateCubic(p1.x, p2.cp1.x, p2.cp2.x, p2.x, betweenPoint.x);
            betweenPoint.y = getCubicValue(t, p1.y, p2.cp1.y, p2.cp2.y, p2.y);
        }

    } else if (p2.cp1) {
        if (betweenPoint.x === null) {
            [v, t] = interpolateQuadratic(p1.y, p2.y, p2.cp1.y, betweenPoint.y);
            betweenPoint.x = v;
        } else if (betweenPoint.y === null) {
            [v, t] = interpolateQuadratic(p1.x, p2.x, p2.cp1.x, betweenPoint.x);
            betweenPoint.y = v;
        }
    } else {
        if (betweenPoint.x === null) {
            [v, t] = interpolateLinear(p1.y, p2.y, betweenPoint.y);
            betweenPoint.x = v;
        } else if (betweenPoint.y === null) {
            [v, t] = interpolateLinear(p1.x, p2.x, betweenPoint.x);
            betweenPoint.y = v;
        }
    }
    betweenPoint.t = t;
    return betweenPoint;
}


/**
 * Return the control point for a quadratic curve between two points with
 * a simple deflection parameter
 * @param p1
 * @param p2
 * @param t How far along the line between p1 and p2 the control point should start
 * @param deflection Which direction and how far perpendicular to the p1-p2 line
 * the control point should be
 * @returns {{x: number, y: number}}
 */
export function simpleQuadratic(p1, p2, t = 0.5, deflection = 0) {
    const cp1 = {
        x: p1.x * (1 - t) + p2.x * t,
        y: p1.y * (1 - t) + p2.y * t
    };
    const unitPerpendicular = getPerpendicularVector(diff(p1, p2));
    cp1.x += deflection * unitPerpendicular.x;
    cp1.y += deflection * unitPerpendicular.y;
    return cp1;
}


/**
 * Get the cubic bezier control point representation of the curve from start to end.
 * If end already has 2 control points return them; if end has only 1 control point (quadratic)
 * then return 2 control points that would lead to an equivalent curve; if end has no control
 * point (linear) then return 2 control points located identically at the midpoint between
 * start and end.
 * @param start
 * @param end
 * @returns {[*,*]} cp1 and cp2 of end point
 */
export function getCubicControlPoints(start, end) {
    // already a cubic, just return directly
    if (end.cp1 && end.cp2) {
        return [end.cp1, end.cp2];
    }
    // quadratic
    const cp = end.cp1 || end.cp2;
    if (cp) {
        const cp1 = {
            x: start.x + 2 / 3 * (cp.x - start.x),
            y: start.y + 2 / 3 * (cp.y - start.y)
        };
        const cp2 = {
            x: end.x + 2 / 3 * (cp.x - end.x),
            y: end.y + 2 / 3 * (cp.y - end.y)
        };
        return [cp1, cp2];
    }
    // linear (infinite possibilities, just choose both of them to be in the middle)
    return [averagePoint(start, end), averagePoint(start, end)];
}

/**
 * Transform start curve into end curve (results in cubic bezier) with the amount
 * of transformation determined by t [0,1]
 * @param startP1
 * @param startP2
 * @param endP1
 * @param endP2
 * @param t Amount to transform, [0,1] 0 is no transformation at all and is equal to the start curve;
 * 1 is full transformation and is equal to the end curve
 * @returns Replacement draw point for endP2
 */
export function transformCurve(startP1, startP2, endP1, endP2, t) {
    if (!startP2) {
        return endP2;
    }
    if (!endP2) {
        return startP2;
    }
    const [startCp1, startCp2] = getCubicControlPoints(startP1, startP2);
    const [endCp1, endCp2] = getCubicControlPoints(endP1, endP2);
    return {
        x  : startP2.x * (1 - t) + endP2.x * t,
        y  : startP2.y * (1 - t) + endP2.y * t,
        cp1: {
            x: startCp1.x * (1 - t) + endCp1.x * t,
            y: startCp1.y * (1 - t) + endCp1.y * t
        },
        cp2: {
            x: startCp2.x * (1 - t) + endCp2.x * t,
            y: startCp2.y * (1 - t) + endCp2.y * t
        },
    };
}