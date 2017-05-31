/**
 * Created by johnson on 11.05.17.
 */

import {add, makePoint, extractPoint, diff, getPerpendicularVector} from "./point";
import {roundToDec} from "./numeric";

export function applyToCurve(p1, p2, {linear, quadratic, cubic}) {
    const ep1 = extractPoint(p1);
    const ep2 = extractPoint(p2);
    if (p2.cp1 && p2.cp2) {
        return cubic(ep1, p2.cp1, p2.cp2, ep2);
    }
    const cp = p2.cp1 || p2.cp2;
    if (cp) {
        return quadratic(ep1, cp, ep2);
    } else {
        return linear(ep1, ep2);
    }
}

/**
 * Get a point at t (out of [0,1]) along the [p1, p2] curve
 * @param t
 * @param p1
 * @param p2
 * @returns {*}
 */
export function getPointOnCurve(t, p1, p2) {
    return applyToCurve(p1, p2, {
        linear: (...cps) => getPointOnLine(t, ...cps),
        quadratic(...cps) {
            return makePoint(getQuadraticValue.bind(null, t), ...cps);
        },
        cubic(...cps) {
            return makePoint(getCubicValue.bind(null, t), ...cps);
        },
    });
}

/**
 * Shorthand for getting point on a line connecting p1 -> p2
 * Useful for force treatment of p2 as a linear end point even if it has control points
 * @param t
 * @param p1
 * @param p2
 * @returns {*}
 */
export function getPointOnLine(t, p1, p2) {
    return makePoint(getLinearValue.bind(null, t), p1, p2);
}

function getLinearValue(t, p1, p2) {
    // (1 - t) * p1 + t * p2
    return t * (p2 - p1) + p1;
}

function getQuadraticValue(t, p1, cp, p2) {
    // (1 - t)^2 * p1 + 2(1 - t)t * cp + t^2 * p2
    // gather coefficients of t^2, t, and 1
    return (p1 + p2 - 2 * cp) * t * t + 2 * (cp - p1) * t + p1;
}

function getCubicValue(t, p1, cp1, cp2, p2) {
    // (1 - t)^3 * p1 + 3(1 - t)^2 * t * cp1 + 3(1 - t)t^2 * cp2 + t^3 * p2
    // leave in unexpanded form
    return p1 * (1 - t) * (1 - t) * (1 - t) + 3 * cp1 * (1 - t) * (1 - t) * t +
           3 * cp2 * (1 - t) * t * t + p2 * t * t * t;
}

function splitBezier(t, p1, cp1, cp2, p2) {
    // split a cubic cubic based on De Casteljau, t is between [0,1]
    // just a series of linear interpolations
    const E = getPointOnLine(t, p1, cp1);
    const F = getPointOnLine(t, cp1, cp2);
    const G = getPointOnLine(t, cp2, p2);
    const H = getPointOnLine(t, E, F);
    const J = getPointOnLine(t, F, G);
    const K = getPointOnLine(t, H, J);

    const left = {
        p1,
        p2: K
    };
    left.p2.cp1 = E;
    left.p2.cp2 = H;

    const right = {
        p1: extractPoint(K),
        p2
    };
    right.p2.cp1 = J;
    right.p2.cp2 = G;

    return {
        left,
        right
    };
}

function splitQuadratic(t, p1, cp, p2) {
    // split a quadratic cubic based on De Casteljau, t is between [0,1]
    const D = getPointOnLine(t, p1, cp);
    const E = getPointOnLine(t, cp, p2);
    const F = getPointOnLine(t, D, E);

    const left = {
        p1,
        p2: F
    };
    left.p2.cp1 = D;
    const right = {
        p1: extractPoint(F),
        p2
    };
    right.p2.cp1 = E;

    return {
        left,
        right
    };
}

function splitLinear(t, p1, p2) {
    // split a linear linear
    const C = getPointOnLine(t, p1, p2);
    return {
        left : {
            p1,
            p2: C
        },
        right: {
            p1: C,
            p2
        }
    };
}

/**
 * Split the curve between two drawpoints and return all the resulting drawpoints
 * @memberof module:da
 * @param {number} t "time" along the curve to split at. Since all curves are parameterized
 * curves, t is their parameter. Can be thought of as traversing along the curve, where 0 is
 * at the start point and 1 is at the end point. This value can go beyond [0,1].
 * @param {object} p1 Starting drawpoint
 * @param {object} p2 Ending drawpoint and also where we look at the control points
 * @returns {{left, right}} Object having a left and right property, each with their own
 * p1 (start point), p2 (end point), and optionally cp1 and cp2 depending on what kind of
 * curve was split. Note that sp.left.p2 === sp.right.p1 always in value.
 */
export function splitCurve(t, p1, p2) {
    // split either a quadratic or cubic curve depending on number of control points on
    // the end point
    return applyToCurve(p1, p2, {
        linear   : splitLinear.bind(null, t),
        quadratic: splitQuadratic.bind(null, t),
        cubic    : splitBezier.bind(null, t),
    });
}

function interpolateLinear(p1, p2, p) {
    // infinite number of options, can't calculate
    if (p2 === p1) {
        return [];
    }
    // t
    return [(p - p1) / (p2 - p1)];
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


function interpolateQuadratic(p1, cp1, p2, p) {
    const a = (p1 - 2 * cp1 + p2);
    const b = 2 * (cp1 - p1);
    const c = p1 - p;

    // 2 possible values for t
    return solveQuadraticEquation(a, b, c);
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
    const discriminant = roundToDec(q2 * q2 + p3 * p3 * p3, 8);

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

function interpolateCubic(p1, cp1, cp2, p2, p) {
    // and rewrite from [a(1-t)^3 + 3bt(1-t)^2 + 3c(1-t)t^2 + dt^3] form
    p1 -= p;
    cp1 -= p;
    cp2 -= p;
    p2 -= p;

    // to [t^3 + at^2 + bt + c] form:
    const d = -p1 + 3 * cp1 - 3 * cp2 + p2;
    const a = (3 * p1 - 6 * cp1 + 3 * cp2 ) / d;
    const b = (-3 * p1 + 3 * cp1) / d;
    const c = p1 / d;

    return solveCubicEquation(a, b, c).map(t => roundToDec(t, 4));
}


/**
 * Get points along the curve from t = [0,1] that share the fixed dimension as betweenPoint.
 * For example, if betweenPoint = {x:10, y:null}, then we are looking for all points with
 * x = 10.
 * @param p1
 * @param p2
 * @param betweenPoint Query that has either x or y set to null which is to be determined
 * @returns {Array} List of draw points that have a "t" property which is how far they are along the curve
 */
export function interpolateCurve(p1, p2, betweenPoint) {
    let knownDim;
    if (betweenPoint.x === null) {
        knownDim = "y";
    } else if (betweenPoint.y === null) {
        knownDim = "x";
    } else {
        return [];
    }

    const ts = applyToCurve(p1, p2, {
        linear   : (...cps) => interpolateLinear(...cps.map(cp => cp[knownDim]),
            betweenPoint[knownDim]),
        quadratic: (...cps) => interpolateQuadratic(...cps.map(cp => cp[knownDim]),
            betweenPoint[knownDim]),
        cubic    : (...cps) => interpolateCubic(...cps.map(cp => cp[knownDim]),
            betweenPoint[knownDim]),
    }).filter((t) => {
        // solving cubic equations is not very numerically stable...
        t = roundToDec(t, 3);
        return t >= 0 && t <= 1;
    });

    return ts.map((t) => {
        const p = getPointOnCurve(t, p1, p2);
        p.t = t;
        return p;
    });

}


/**
 * Return the control point for a quadratic curve between two points with
 * a simple deflection parameter
 * @param p1
 * @param p2
 * @param t How far along the linear between p1 and p2 the control point should start
 * @param deflection Which direction and how far perpendicular to the p1-p2 linear
 * the control point should be (the norm of the perpendicular vector)
 * @returns {{x: number, y: number}}
 */
export function simpleQuadratic(p1, p2, t = 0.5, deflection = 0) {
    const cp1 = getPointOnLine(t, p1, p2);
    return add(cp1, getPerpendicularVector(diff(p1, p2)), deflection);
}


/**
 * Increase the degree of a cubic curve (e.g. quadratic to cubic) without changing its shape
 * @param p1 Starting point of the curve
 * @param p2 Ending point of the curve and holds the other control points
 */
export function elevateDegree(p1, p2) {
    const cps = [p1];
    for (let cp in p2) {
        if (cp.startsWith("cp") && p2.hasOwnProperty(cp)) {
            cps.push(p2[cp]);
        }
    }
    cps.push(extractPoint(p2));

    const newEndPoint = extractPoint(p2);
    // see https://www.cs.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/Bezier/bezier-elev.html
    for (let i = 1, newDegree = cps.length; i < newDegree; ++i) {
        const coefficient = i / newDegree;

        newEndPoint["cp" + i] = makePoint((cpsPrev, cps) => {
            return coefficient * cpsPrev + (1 - coefficient) * cps;
        }, cps[i - 1], cps[i]);
    }
    return newEndPoint;
}

/**
 * Get the cubic cubic control point representation of the curve from start to end.
 * If end already has 2 control points return them; if end has only 1 control point (quadratic)
 * then return 2 control points that would lead to an equivalent curve; if end has no control
 * point (linear) then return 2 control points located identically at the midpoint between
 * start and end.
 * @param p1
 * @param p2
 * @returns {[*,*]} cp1 and cp2 of end point
 */
export function getCubicControlPoints(p1, p2) {
    return applyToCurve(p1, p2, {
        linear ()  {
            const newEnd = elevateDegree(p1, elevateDegree(p1, p2));
            return [newEnd.cp1, newEnd.cp2];
        },
        quadratic () {
            const newEnd = elevateDegree(p1, p2);
            return [newEnd.cp1, newEnd.cp2];
        },
        cubic: () => [p2.cp1, p2.cp2]
    });
}

/**
 * Transform start curve into end curve (results in cubic cubic) with the amount
 * of transformation determined by t [0,1]. Limited to transforming the end point as the start and
 * end curves must have the same starting point
 * @param t Amount to transform, [0,1] 0 is no transformation at all and is equal to the start curve;
 * 1 is full transformation and is equal to the end curve
 * @param p1
 * @param initP2
 * @param endP2
 * @returns Replacement draw point for endP2
 */
export function transformCurve(t, p1, initP2, endP2) {
    if (!initP2) {
        return endP2;
    }
    if (!endP2) {
        return initP2;
    }
    const [initCp1, initCp2] = getCubicControlPoints(p1, initP2);
    const [endCp1, endCp2] = getCubicControlPoints(p1, endP2);
    const newEnd = getPointOnLine(t, initP2, endP2);
    newEnd.cp1 = getPointOnLine(t, initCp1, endCp1);
    newEnd.cp2 = getPointOnLine(t, initCp2, endCp2);
    return newEnd;
}