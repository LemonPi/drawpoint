"use strict";

import {clone} from "./util";

export function point(x, y) {
    return {x, y};
}

export function makePoint(func, ...cps) {
    return point(
        func(...cps.map(cp => cp.x)),
        func(...cps.map(cp => cp.y)));
}

export const origin = Object.freeze(point(0, 0));

/**
 * Insert this special point in the list of points given to drawPoints to
 * move to the next point instead of drawing to the next point
 * @readonly
 * @type {Object}
 */
export const breakPoint = Object.freeze({
    break: true
});

/**
 * Signals for a fill path to not try to complete it by drawing a curve from end
 * point to first point as the fill has already done its job
 * move to the next point instead of drawing to the next point
 * @readonly
 * @type {Object}
 */
export const endPoint = Object.freeze({
    end: true
});

/**
 * Treat points as vectors and add them, optionally after scaling p2
 * @param p1
 * @param p2
 * @param scaleBy
 * @returns {{x: *, y: *}}
 */
export function add(p1, p2, scaleBy = 1) {
    return makePoint((pp1, pp2) => {
        return pp1 + pp2 * scaleBy;
    }, p1, p2);
}

/**
 * Get the difference of 2 draw points p2 - p1; conceptually a vector pointing p1 -> p2
 * @param {{x:number, y:number}} p1 First point
 * @param {{x:number, y:number}} p2 Second point
 * @returns {{x: number, y: number}}
 */
export function diff(p1, p2) {
    return makePoint((pp1, pp2) => {
        return pp2 - pp1;
    }, p1, p2);
}

/**
 * Get the magnitude of a vector
 * @param vec
 * @returns {number} Euclidean (L^2) norm of vec
 */
export function norm(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

/**
 * Get the angle of a vector in radians
 * @param vec
 * @returns {number} Angle in radians
 */
export function angle(vec) {
    return Math.atan2(vec.y, vec.x);
}

/**
 * Get a point after scaling it relative to a reference point.
 * Grows the vector referencePt -> pt by scaleBy.
 * @param pt
 * @param scaleBy
 * @param referencePt The point from which to scale
 * @returns {{x: *, y: *}}
 */
export function scale(pt, scaleBy, referencePt = origin) {
    return add(referencePt, diff(referencePt, pt), scaleBy);
}



/**
 * Relative to 0,0, get the direction a draw point/vector is pointing at
 * @param vec
 * @returns {{x: number, y: number}}
 */
export function getUnitVector(vec) {
    const magnitude = norm(vec);
    return makePoint(v => v / magnitude, vec);
}

/**
 * Get counterclockwise perpendicular unit vector
 * @param vec Point that doubles as a vector from (0,0) to the point
 * @returns {{x: number, y: number}}
 */
export function getPerpendicularVector(vec) {
    // rotate counterclockwise by 90 degrees
    return getUnitVector(point(-vec.y, vec.x));
}

/**
 * Remove any extra information from a point down to just x,y
 */
export function extractPoint(pt) {
    return point(pt.x, pt.y);
}

/**
 * Remove any extra information from a point and reflect across y axis
 */
export function reflect(pt, m = Infinity, b = 0) {
    if (!pt) {
        return pt;
    }
    let c, cm;

    // vertical linear
    if (m === Infinity) {
        c = 0;
        cm = 0;
        // has no single y-intercept
        b = pt.y;
    } else {
        c = (pt.x + (pt.y - b) * m) / (1 + m * m);
        cm = c * m;
    }

    return point(
        2 * c - pt.x,
        2 * cm - pt.y + 2 * b
    );
}

/**
 * Shift a draw point and its control points
 * @param {object} pt
 * @param {number} dx
 * @param {number} dy
 * @returns {object}
 */
export function adjust(pt, dx, dy) {
    if (!pt) {
        return pt;
    }
    // return a point with x and y adjusted by dx and dy respectively
    const movedPoint = point(pt.x + dx, pt.y + dy);
    if (pt.cp1) {
        movedPoint.cp1 = point(pt.cp1.x + dx, pt.cp1.y + dy);
    }
    if (pt.cp2) {
        movedPoint.cp2 = point(pt.cp2.x + dx, pt.cp2.y + dy);
    }
    return movedPoint;
}

/**
 * Shift a sequence of draw points
 * @param dx
 * @param dy
 * @param points
 * @returns {Array}
 */
export function adjustPoints(dx, dy, ...points) {
    const shiftedPoints = [];
    points.forEach((pt) => {
        shiftedPoints.push(adjust(pt, dx, dy));
    });
    return shiftedPoints;
}

/**
 * Explode or shrink points around a center point
 * @param center The point other points are scaled relative to
 * @param {number} scaleBy Multiplier for the distance between each point and center
 * @param points Points to scale relative to center
 */
export function scalePoints(center, scaleBy, ...points) {
    points.forEach((pt) => {
        if (!pt || pt.hasOwnProperty("x") === false) {
            return;
        }
        const {x, y} = scale(pt, scaleBy, center);
        pt.x = x;
        pt.y = y;
        if (pt.cp1) {
            pt.cp1 = scale(pt.cp1, scaleBy, center);
        }
        if (pt.cp2) {
            pt.cp2 = scale(pt.cp2, scaleBy, center);
        }
    });
}

/**
 * Rotate a set of points about a pivot in place
 * @param {object} pivot The point to rotate about
 * @param {number} rad Radians counterclockwise to rotate points
 * @param points List of points to rotate about pivot
 */
export function rotatePoints(pivot, rad, ...points) {
    let cos = Math.cos(rad), sin = Math.sin(rad);
    points.forEach((pt) => {
        if (!pt || pt.hasOwnProperty("x") === false) {
            return;
        }
        rotateDiff(pivot, pt, sin, cos);
        if (pt.cp1) {
            rotateDiff(pivot, pt.cp1, sin, cos);
        }
        if (pt.cp2) {
            rotateDiff(pivot, pt.cp2, sin, cos);
        }
    });
}

/**
 * Helper for rotate points to be used with cached sin and cos
 * @param pivot Point around which to rotate
 * @param pt Point to be rotated
 * @param sin Cached sin(rad) to rotate by
 * @param cos Cached cos(rad) to rotate by
 */
function rotateDiff(pivot, pt, sin, cos) {
    const pointDiff = diff(pivot, pt);
    const dx = pointDiff.x * cos - pointDiff.y * sin;
    const dy = pointDiff.x * sin + pointDiff.y * cos;
    pt.x = pivot.x + dx;
    pt.y = pivot.y + dy;
}

