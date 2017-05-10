"use strict";

import {clone} from "./util";

export function point(x, y) {
    return {x, y};
}

export function averagePoint(p1, p2, bias = 0.5) {
    return point(
        p1.x * (1 - bias) + p2.x * bias,
        p1.y * (1 - bias) + p2.y * bias
    );
}

/**
 * Get the difference of 2 draw points p2 - p1
 * @param {{x:number, y:number}} p1 First point
 * @param {{x:number, y:number}} p2 Second point
 * @returns {{x: number, y: number}}
 */
export function diff(p1, p2) {
    return point(
        p2.x - p1.x,
        p2.y - p1.y
    );
}

/**
 * Get the magnitude of a vector
 * @memberof module:da
 * @param {number[]} arguments components of the vector
 * @returns {number}
 */
export function norm() {
    let tot = 0;
    for (let i = 0; i < arguments.length; ++i) {
        tot += arguments[i] * arguments[i];
    }
    return Math.sqrt(tot);
}

/**
 * Scale the difference between 2 points relative to the first point
 * @param {{x:number, y:number}} p1 First point
 * @param {{x:number, y:number}} p2 Second point
 * @param {number} scale How much to scale the difference (can be greater than 1 and less than 0)
 * @returns {{x: number, y: number}}
 */
export function scale(p1, p2, scale) {
    const pointDiff = diff(p1, p2);
    pointDiff.x *= scale;
    pointDiff.y *= scale;
    return point(
        p1.x + pointDiff.x,
        p1.y + pointDiff.y
    );
}

/**
 * Treat points as vectors and add them, optionally after scaling p2
 * @param p1
 * @param p2
 * @param scale
 * @returns {{x: *, y: *}}
 */
export function addVector(p1, p2, scale = 1) {
    return point(
        p1.x + p2.x * scale,
        p1.y + p2.y * scale
    );
}

/**
 * Relative to 0,0, get the direction a draw point/vector is pointing at
 * @param vec
 * @returns {{x: number, y: number}}
 */
export function getUnitVector(vec) {
    const magnitude = norm(vec.x, vec.y);
    return point(
        vec.x / magnitude,
        vec.y / magnitude
    );
}

export function getPerpendicularVector(vec) {
    // rotate counterclockwise by 90 degrees
    return getUnitVector(point(
        -vec.y,
        vec.x
    ));
}


/**
 * Shift a draw point and its control points
 * @param {object} pt
 * @param {number} dx
 * @param {number} dy
 * @returns {object}
 */
export function adjustPoint(pt, dx, dy) {
    if (!pt) {
        return pt;
    }
    // return a point with x and y adjusted by dx and dy respectively
    const movedPoint = clone(pt);
    movedPoint.x += dx;
    movedPoint.y += dy;
    if (movedPoint.cp1) {
        movedPoint.cp1.x += dx;
        movedPoint.cp1.y += dy;
    }
    if (movedPoint.cp2) {
        movedPoint.cp2.x += dx;
        movedPoint.cp2.y += dy;
    }
    return movedPoint;
}

/**
 * Shift a sequence of draw points points
 * @param dx
 * @param dy
 * @param points
 * @returns {Array}
 */
export function shiftPoints(dx, dy, ...points) {
    const shiftedPoints = [];
    points.forEach((pt) => {
        shiftedPoints.push(adjustPoint(pt, dx, dy));
    });
    return shiftedPoints;
}

/**
 * Remove any extra information from a point down to just x,y
 */
export function extractPoint(pt) {
    return pt(
        pt.x,
        pt.y
    );
}

/**
 * Remove any extra information from a point and reflect across y axis
 */
export function reflectPoint(pt) {
    if (!pt) {
        return pt;
    }
    return point(
        -pt.x,
        pt.y
    );
}

/**
 * Explode or shrink points around a center point
 * @param center The point other points are scaled relative to
 * @param scaleBy Multiplier for the distance between each point and center
 * @param points Points to scale relative to center
 */
export function scalePoints(center, scaleBy, ...points) {
    for (let i = 0; i < points.length; ++i) {
        let p = points[i];
        if (!p || p.hasOwnProperty("x") === false) {
            continue;
        }
        const {x, y} =  scale(center, p, scaleBy);
        p.x = x;
        p.y = y;
        if (p.hasOwnProperty("cp1")) {
            p.cp1 = scale(center, p.cp1, scaleBy);
        }
        if (p.hasOwnProperty("cp2")) {
            p.cp2 = scale(center, p.cp2, scaleBy);
        }
    }
}

/**
 * Rotate a set of points about a pivot
 * @param {object} pivot The point to rotate about
 * @param {number} rad Radians counterclockwise to rotate points
 * @param {object[]} points List of points to rotate about pivot
 */
export function rotatePoints(pivot, rad, ...points) {
    let cos = Math.cos(rad), sin = Math.sin(rad);
    for (let i = 0; i < points.length; ++i) {
        let p = points[i];
        if (!p || p.hasOwnProperty("x") === false) {
            continue;
        }
        rotateDiff(pivot, p, sin, cos);
        if (p.cp1) {
            rotateDiff(pivot, p.cp1, sin, cos);
        }
        if (p.cp2) {
            rotateDiff(pivot, p.cp2, sin, cos);
        }
    }
}

/**
 * Helper for rotate points to be used with cached sin and cos
 * @param pivot
 * @param pt
 * @param sin
 * @param cos
 */
function rotateDiff(pivot, pt, sin, cos) {
    let pointDiff = diff(pivot, pt);
    pt.x -= pointDiff.x;
    pt.y -= pointDiff.y;
    pointDiff.dx = pointDiff.x * cos - pointDiff.y * sin;
    pointDiff.dy = pointDiff.x * sin + pointDiff.y * cos;
    pt.x += pointDiff.dx;
    pt.y += pointDiff.dy;
}

