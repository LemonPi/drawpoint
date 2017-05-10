"use strict";

export function clone(obj) {
    if (obj) {
        return JSON.parse(JSON.stringify(obj));
    } else {
        return obj;
    }
}

export function averagePoint(p1, p2, bias = 0.5) {
    return {
        x: p1.x * (1 - bias) + p2.x * bias,
        y: p1.y * (1 - bias) + p2.y * bias
    };
}

/**
 * Get the difference of 2 draw points p2 - p1
 * @param {{x:number, y:number}} p1 First point
 * @param {{x:number, y:number}} p2 Second point
 * @returns {{x: number, y: number}}
 */
export function diff(p1, p2) {
    return {
        x: p2.x - p1.x,
        y: p2.y - p1.y
    };
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
    return {
        x: p1.x + pointDiff.x,
        y: p1.y + pointDiff.y
    };
}

/**
 * Treat points as vectors and add them, optionally after scaling p2
 * @param p1
 * @param p2
 * @param scale
 * @returns {{x: *, y: *}}
 */
export function addVector(p1, p2, scale = 1) {
    return {
        x: p1.x + p2.x * scale,
        y: p1.y + p2.y * scale
    };
}

/**
 * Relative to 0,0, get the direction a draw point/vector is pointing at
 * @param vec
 * @returns {{x: number, y: number}}
 */
export function getUnitVector(vec) {
    const magnitude = norm(vec.x, vec.y);
    return {
        x: vec.x / magnitude,
        y: vec.y / magnitude
    };
}

export function getPerpendicularVector(vec) {
    // rotate counterclockwise by 90 degrees
    return getUnitVector({
        x: -vec.y,
        y: vec.x
    });
}


/**
 * Shift a draw point and its control points
 * @param {object} point
 * @param {number} dx
 * @param {number} dy
 * @returns {object}
 */
export function adjustPoint(point, dx, dy) {
    if (!point) {
        return point;
    }
    // return a point with x and y adjusted by dx and dy respectively
    const movedPoint = clone(point);
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
    points.forEach((point) => {
        shiftedPoints.push(adjustPoint(point, dx, dy));
    });
    return shiftedPoints;
}

/**
 * Remove any extra information from a point down to just x,y
 */
export function extractPoint(point) {
    return {
        x: point.x,
        y: point.y
    };
}

/**
 * Remove any extra information from a point and reflect across y axis
 * @memberof module:da
 */
export function reflectPoint(point) {
    if (!point) {
        return point;
    }
    return {
        x: -point.x,
        y: point.y,
    };
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
 * @param point
 * @param sin
 * @param cos
 */
function rotateDiff(pivot, point, sin, cos) {
    let pointDiff = diff(pivot, point);
    point.x -= pointDiff.x;
    point.y -= pointDiff.y;
    pointDiff.dx = pointDiff.x * cos - pointDiff.y * sin;
    pointDiff.dy = pointDiff.x * sin + pointDiff.y * cos;
    point.x += pointDiff.dx;
    point.y += pointDiff.dy;
}

