(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["drawpoint"] = factory();
	else
		root["drawpoint"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.endPoint = exports.breakPoint = undefined;
exports.point = point;
exports.averagePoint = averagePoint;
exports.diff = diff;
exports.norm = norm;
exports.scale = scale;
exports.addVector = addVector;
exports.getUnitVector = getUnitVector;
exports.getPerpendicularVector = getPerpendicularVector;
exports.adjustPoint = adjustPoint;
exports.shiftPoints = shiftPoints;
exports.extractPoint = extractPoint;
exports.reflectPoint = reflectPoint;
exports.scalePoints = scalePoints;
exports.rotatePoints = rotatePoints;

var _util = __webpack_require__(3);

function point(x, y) {
    return { x: x, y: y };
}

/**
 * Insert this special point in the list of points given to drawPoints to
 * move to the next point instead of drawing to the next point
 * @readonly
 * @type {Object}
 */
var breakPoint = exports.breakPoint = Object.freeze({
    break: true
});

/**
 * Signals for a fill path to not try to complete it by drawing a curve from end
 * point to first point as the fill has already done its job
 * move to the next point instead of drawing to the next point
 * @readonly
 * @type {Object}
 */
var endPoint = exports.endPoint = Object.freeze({
    end: true
});

function averagePoint(p1, p2) {
    var bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;

    return point(p1.x * (1 - bias) + p2.x * bias, p1.y * (1 - bias) + p2.y * bias);
}

/**
 * Get the difference of 2 draw points p2 - p1
 * @param {{x:number, y:number}} p1 First point
 * @param {{x:number, y:number}} p2 Second point
 * @returns {{x: number, y: number}}
 */
function diff(p1, p2) {
    return point(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Get the magnitude of a vector
 * @memberof module:da
 * @param {number[]} arguments components of the vector
 * @returns {number}
 */
function norm() {
    var tot = 0;
    for (var i = 0; i < arguments.length; ++i) {
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
function scale(p1, p2, scale) {
    var pointDiff = diff(p1, p2);
    pointDiff.x *= scale;
    pointDiff.y *= scale;
    return point(p1.x + pointDiff.x, p1.y + pointDiff.y);
}

/**
 * Treat points as vectors and add them, optionally after scaling p2
 * @param p1
 * @param p2
 * @param scale
 * @returns {{x: *, y: *}}
 */
function addVector(p1, p2) {
    var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    return point(p1.x + p2.x * scale, p1.y + p2.y * scale);
}

/**
 * Relative to 0,0, get the direction a draw point/vector is pointing at
 * @param vec
 * @returns {{x: number, y: number}}
 */
function getUnitVector(vec) {
    var magnitude = norm(vec.x, vec.y);
    return point(vec.x / magnitude, vec.y / magnitude);
}

/**
 * Get counterclockwise perpendicular unit vector
 * @param vec Point that doubles as a vector from (0,0) to the point
 * @returns {{x: number, y: number}}
 */
function getPerpendicularVector(vec) {
    // rotate counterclockwise by 90 degrees
    return getUnitVector(point(-vec.y, vec.x));
}

/**
 * Shift a draw point and its control points
 * @param {object} pt
 * @param {number} dx
 * @param {number} dy
 * @returns {object}
 */
function adjustPoint(pt, dx, dy) {
    if (!pt) {
        return pt;
    }
    // return a point with x and y adjusted by dx and dy respectively
    var movedPoint = (0, _util.clone)(pt);
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
function shiftPoints(dx, dy) {
    var shiftedPoints = [];

    for (var _len = arguments.length, points = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        points[_key - 2] = arguments[_key];
    }

    points.forEach(function (pt) {
        shiftedPoints.push(adjustPoint(pt, dx, dy));
    });
    return shiftedPoints;
}

/**
 * Remove any extra information from a point down to just x,y
 */
function extractPoint(pt) {
    return pt(pt.x, pt.y);
}

/**
 * Remove any extra information from a point and reflect across y axis
 */
function reflectPoint(pt) {
    if (!pt) {
        return pt;
    }
    return point(-pt.x, pt.y);
}

/**
 * Explode or shrink points around a center point
 * @param center The point other points are scaled relative to
 * @param scaleBy Multiplier for the distance between each point and center
 * @param points Points to scale relative to center
 */
function scalePoints(center, scaleBy) {
    for (var _len2 = arguments.length, points = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        points[_key2 - 2] = arguments[_key2];
    }

    for (var i = 0; i < points.length; ++i) {
        var p = points[i];
        if (!p || p.hasOwnProperty("x") === false) {
            continue;
        }

        var _scale = scale(center, p, scaleBy),
            x = _scale.x,
            y = _scale.y;

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
function rotatePoints(pivot, rad) {
    var cos = Math.cos(rad),
        sin = Math.sin(rad);

    for (var _len3 = arguments.length, points = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        points[_key3 - 2] = arguments[_key3];
    }

    for (var i = 0; i < points.length; ++i) {
        var p = points[i];
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
    var pointDiff = diff(pivot, pt);
    pt.x -= pointDiff.x;
    pt.y -= pointDiff.y;
    pointDiff.dx = pointDiff.x * cos - pointDiff.y * sin;
    pointDiff.dy = pointDiff.x * sin + pointDiff.y * cos;
    pt.x += pointDiff.dx;
    pt.y += pointDiff.dy;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Created by johnson on 11.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

exports.splitCurve = splitCurve;
exports.interpolateCurve = interpolateCurve;
exports.simpleQuadratic = simpleQuadratic;
exports.getCubicControlPoints = getCubicControlPoints;
exports.transformCurve = transformCurve;

var _point = __webpack_require__(0);

var _numeric = __webpack_require__(2);

function splitBezier(points, t) {
    // split a cubic bezier based on De Casteljau, t is between [0,1]
    var A = points.p1,
        B = points.cp1,
        C = points.cp2,
        D = points.p2;
    var E = {
        x: A.x * (1 - t) + B.x * t,
        y: A.y * (1 - t) + B.y * t
    };
    var F = {
        x: B.x * (1 - t) + C.x * t,
        y: B.y * (1 - t) + C.y * t
    };
    var G = {
        x: C.x * (1 - t) + D.x * t,
        y: C.y * (1 - t) + D.y * t
    };
    var H = {
        x: E.x * (1 - t) + F.x * t,
        y: E.y * (1 - t) + F.y * t
    };
    var J = {
        x: F.x * (1 - t) + G.x * t,
        y: F.y * (1 - t) + G.y * t
    };
    var K = {
        x: H.x * (1 - t) + J.x * t,
        y: H.y * (1 - t) + J.y * t
    };
    return {
        left: {
            p1: A,
            cp1: E,
            cp2: H,
            p2: K
        },
        right: {
            p1: K,
            cp1: J,
            cp2: G,
            p2: D
        }
    };
}

function splitQuadratic(points, t) {
    // split a quadratic bezier based on De Casteljau, t is between [0,1]
    var A = points.p1,
        B = points.cp1,
        C = points.p2;
    var D = {
        x: A.x * (1 - t) + B.x * t,
        y: A.y * (1 - t) + B.y * t
    };
    var E = {
        x: B.x * (1 - t) + C.x * t,
        y: B.y * (1 - t) + C.y * t
    };
    var F = {
        x: D.x * (1 - t) + E.x * t,
        y: D.y * (1 - t) + E.y * t
    };

    return {
        left: {
            p1: A,
            cp1: D,
            p2: F
        },
        right: {
            p1: F,
            cp1: E,
            p2: C
        }
    };
}

function splitLinear(points, t) {
    // split a linear line
    var A = points.p1,
        B = points.p2;
    var C = {
        x: A.x * (1 - t) + B.x * t,
        y: A.y * (1 - t) + B.y * t
    };
    return {
        left: {
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
function splitCurve(p1, p2, t) {
    // split either a quadratic or bezier curve depending on number of control points on
    // the end point
    if (p2.cp1 && p2.cp2) {
        return splitBezier({
            p1: (0, _point.extractPoint)(p1),
            p2: (0, _point.extractPoint)(p2),
            cp1: p2.cp1,
            cp2: p2.cp2
        }, t);
    }
    var cp = p2.cp1 || p2.cp2;
    if (cp) {
        return splitQuadratic({
            p1: (0, _point.extractPoint)(p1),
            p2: (0, _point.extractPoint)(p2),
            cp1: cp
        }, t);
    } else {
        return splitLinear({
            p1: (0, _point.extractPoint)(p1),
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
    var t = (p - p1) / (p2 - p1);
    return [t * (p2 - p1) + p1, t];
}

function solveQuadraticEquation(a, b, c) {

    var discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return [];
    } else {
        return [(-b + Math.sqrt(discriminant)) / (2 * a), (-b - Math.sqrt(discriminant)) / (2 * a)];
    }
}

function interpolateQuadratic(p1, p2, cp1, p) {
    var a = p1 - 2 * cp1 + p2;
    var b = 2 * (cp1 - p1);
    var c = p1 - p;

    // 2 possible values for t
    var ts = solveQuadraticEquation(a, b, c);
    if (ts.length === 0) {
        console.log("Quadratic interpolation out of bounds");
        return null;
    }

    var t = ts[0];
    if (ts.length === 2) {
        if (t < 0 || t > 1) {
            t = ts[1];
        }
    }

    // t outside of 0 or 1 means something's wrong
    if (t < 0 || t > 1) {
        console.log("Quadratic interpolation out of bounds");
    }

    return [(p1 - 2 * cp1 + p1) * t * t + 2 * (cp1 - p1) * t + p1, t];
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

    var a3 = a / 3;
    // reduce to t^3 + p * t + q = 0 form
    // always reducible by substituting x = t - a / 3
    var p = (3 * b - a * a) / 3;
    var p3 = p / 3;
    var q = (2 * a * a * a - 9 * a * b + 27 * c) / 27;
    var q2 = q / 2;

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
    var discriminant = (0, _numeric.roundToDec)(q2 * q2 + p3 * p3 * p3, 8);

    // 1 real root
    if (discriminant > 0) {
        var sqrtDiscriminant = Math.sqrt(discriminant);
        var u = cubeRoot(-q2 + sqrtDiscriminant);
        var v = cubeRoot(q2 + sqrtDiscriminant);
        var _x = u - v - a3;
        // ignore other imaginary roots
        return [_x];
    }

    // all roots real (3 in total, 1 single and 1 double)
    if (discriminant === 0) {
        // v = -u
        var _u = cubeRoot(-q2);
        // t = u - v, x = t - a/3 = u - v - a/3 = 2u - a/3
        var _x2 = 2 * _u - a3;
        // conjugate roots produce 1 double root
        var _x3 = -_u - a3;
        return [_x2, _x3];
    }

    // all roots are real and different (unpleasant imaginary discriminant)
    // first represent in polar form (a + bi) = r(cos(phi) + i*sin(phi))
    // factoring out i = sqrt(-1)
    // u^3 = -q/2 + i*sqrt(-discriminant)
    // v^3 = q/2  + i*sqrt(-discriminant)
    // for u^3, a = -q/2, b = sqrt(-discriminant)
    // r^2 = a^2 + b^2 = (-q/2)^2 - discriminant
    // r^2 = (q/2)^2 - ((q/2)^2 + (p/3)^3) = -(p/3)^3
    var r = Math.sqrt(-p3 * p3 * p3);
    // cos(phi) = a/r (triangle with a along Re, b along Im and r hypotenuse)
    var cosphi = -q2 / r;
    // correct for float rounding
    if (cosphi < -1) {
        cosphi = -1;
    } else if (cosphi > 1) {
        cosphi = 1;
    }
    var phi = Math.acos(cosphi);
    // de Moivre's law -> [r(cos(phi) + i*sin(phi)]^n = r^n * (cos(phi/n) + i*sin(phi/n))
    // values below easy to see if seen as vectors in complex plane
    // u = r^(1/3) * (cos(phi/3)  + i*sin(phi/3))
    // v = r^(1/3) * (-cos(phi/3) + i*sin(phi/3))
    // x = u - v - a/3
    // imaginary parts cancel out
    var commonPrefix = 2 * cubeRoot(r);
    var x1 = commonPrefix * Math.cos(phi / 3) - a3;
    var x2 = commonPrefix * Math.cos((phi + 2 * Math.PI) / 3) - a3;
    var x3 = commonPrefix * Math.cos((phi + 4 * Math.PI) / 3) - a3;
    return [x1, x2, x3];
}

function interpolateCubic(p0, p1, p2, p3, p) {
    // and rewrite from [a(1-t)^3 + 3bt(1-t)^2 + 3c(1-t)t^2 + dt^3] form
    p0 -= p;
    p1 -= p;
    p2 -= p;
    p3 -= p;

    // to [t^3 + at^2 + bt + c] form:
    var d = -p0 + 3 * p1 - 3 * p2 + p3;
    var a = (3 * p0 - 6 * p1 + 3 * p2) / d;
    var b = (-3 * p0 + 3 * p1) / d;
    var c = p0 / d;

    var roots = solveCubicEquation(a, b, c);

    var ts = [];
    var root = void 0;
    for (var i = 0; i < roots.length; i++) {
        root = (0, _numeric.roundToDec)(roots[i], 15);
        if (root >= 0 && root <= 1) {
            ts.push(root);
        }
    }

    return ts;
}

function getCubicValue(t, a, b, c, d) {
    return a * (1 - t) * (1 - t) * (1 - t) + 3 * b * (1 - t) * (1 - t) * t + 3 * c * (1 - t) * t * t + d * t * t * t;
}

function interpolateCurve(p1, p2, betweenPoint) {
    var v = void 0,
        t = void 0;
    if (p2.cp2) {
        if (betweenPoint.x === null) {
            var _interpolateCubic = interpolateCubic(p1.y, p2.cp1.y, p2.cp2.y, p2.y, betweenPoint.y);

            var _interpolateCubic2 = _slicedToArray(_interpolateCubic, 1);

            t = _interpolateCubic2[0];

            betweenPoint.x = getCubicValue(t, p1.x, p2.cp1.x, p2.cp2.x, p2.x);
        } else if (betweenPoint.y === null) {
            var _interpolateCubic3 = interpolateCubic(p1.x, p2.cp1.x, p2.cp2.x, p2.x, betweenPoint.x);

            var _interpolateCubic4 = _slicedToArray(_interpolateCubic3, 1);

            t = _interpolateCubic4[0];

            betweenPoint.y = getCubicValue(t, p1.y, p2.cp1.y, p2.cp2.y, p2.y);
        }
    } else if (p2.cp1) {
        if (betweenPoint.x === null) {
            var _interpolateQuadratic = interpolateQuadratic(p1.y, p2.y, p2.cp1.y, betweenPoint.y);

            var _interpolateQuadratic2 = _slicedToArray(_interpolateQuadratic, 2);

            v = _interpolateQuadratic2[0];
            t = _interpolateQuadratic2[1];

            betweenPoint.x = v;
        } else if (betweenPoint.y === null) {
            var _interpolateQuadratic3 = interpolateQuadratic(p1.x, p2.x, p2.cp1.x, betweenPoint.x);

            var _interpolateQuadratic4 = _slicedToArray(_interpolateQuadratic3, 2);

            v = _interpolateQuadratic4[0];
            t = _interpolateQuadratic4[1];

            betweenPoint.y = v;
        }
    } else {
        if (betweenPoint.x === null) {
            var _interpolateLinear = interpolateLinear(p1.y, p2.y, betweenPoint.y);

            var _interpolateLinear2 = _slicedToArray(_interpolateLinear, 2);

            v = _interpolateLinear2[0];
            t = _interpolateLinear2[1];

            betweenPoint.x = v;
        } else if (betweenPoint.y === null) {
            var _interpolateLinear3 = interpolateLinear(p1.x, p2.x, betweenPoint.x);

            var _interpolateLinear4 = _slicedToArray(_interpolateLinear3, 2);

            v = _interpolateLinear4[0];
            t = _interpolateLinear4[1];

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
function simpleQuadratic(p1, p2) {
    var t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var deflection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    var cp1 = {
        x: p1.x * (1 - t) + p2.x * t,
        y: p1.y * (1 - t) + p2.y * t
    };
    var unitPerpendicular = (0, _point.getPerpendicularVector)((0, _point.diff)(p1, p2));
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
function getCubicControlPoints(start, end) {
    // already a cubic, just return directly
    if (end.cp1 && end.cp2) {
        return [end.cp1, end.cp2];
    }
    // quadratic
    var cp = end.cp1 || end.cp2;
    if (cp) {
        var cp1 = {
            x: start.x + 2 / 3 * (cp.x - start.x),
            y: start.y + 2 / 3 * (cp.y - start.y)
        };
        var cp2 = {
            x: end.x + 2 / 3 * (cp.x - end.x),
            y: end.y + 2 / 3 * (cp.y - end.y)
        };
        return [cp1, cp2];
    }
    // linear (infinite possibilities, just choose both of them to be in the middle)
    return [(0, _point.averagePoint)(start, end), (0, _point.averagePoint)(start, end)];
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
function transformCurve(startP1, startP2, endP1, endP2, t) {
    if (!startP2) {
        return endP2;
    }
    if (!endP2) {
        return startP2;
    }

    var _getCubicControlPoint = getCubicControlPoints(startP1, startP2),
        _getCubicControlPoint2 = _slicedToArray(_getCubicControlPoint, 2),
        startCp1 = _getCubicControlPoint2[0],
        startCp2 = _getCubicControlPoint2[1];

    var _getCubicControlPoint3 = getCubicControlPoints(endP1, endP2),
        _getCubicControlPoint4 = _slicedToArray(_getCubicControlPoint3, 2),
        endCp1 = _getCubicControlPoint4[0],
        endCp2 = _getCubicControlPoint4[1];

    return {
        x: startP2.x * (1 - t) + endP2.x * t,
        y: startP2.y * (1 - t) + endP2.y * t,
        cp1: {
            x: startCp1.x * (1 - t) + endCp1.x * t,
            y: startCp1.y * (1 - t) + endCp1.y * t
        },
        cp2: {
            x: startCp2.x * (1 - t) + endCp2.x * t,
            y: startCp2.y * (1 - t) + endCp2.y * t
        }
    };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deg = deg;
exports.rad = rad;
exports.clamp = clamp;
exports.roundToDec = roundToDec;
/**
 * Created by Johnson on 2017-04-02.
 */

/**
 * Convert radians to degrees
 * @param radian
 * @returns {number}
 */
function deg(radian) {
  return 180 * radian / Math.PI;
}

/**
 * Convert degrees to radians
 * @param degree
 * @returns {number}
 */
function rad(degree) {
  return degree * Math.PI / 180;
}

/**
 * Clamp a number between a minimum and maximum value
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number} Clamped number
 */
function clamp(num, min, max) {
  return num < min ? min : num > max ? max : num;
}

/**
 * Round a number to a fixed number of decimals
 * @param {number} num Number to round
 * @param {number} numDecimals Number of decimals
 * @returns {number}
 */
function roundToDec(num, numDecimals) {
  return parseFloat(num.toFixed(numDecimals));
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clone = clone;
exports.fillerDefinition = fillerDefinition;
/**
 * Created by johnson on 10.05.17.
 */

function clone(obj) {
    if (obj) {
        return JSON.parse(JSON.stringify(obj));
    } else {
        return obj;
    }
}

/**
 * Define a draw point if it doesn't exist already
 * @param {object} ex Export holding draw points
 * @param {string} drawPointName Name of the location
 * @param {object} definition Object holding x, y, cp1, and cp2
 */
function fillerDefinition(ex, drawPointName) {
    var definition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (ex.hasOwnProperty(drawPointName)) {
        return;
    }
    ex[drawPointName] = definition;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.extractRGB = extractRGB;
exports.extractHSL = extractHSL;
exports.extractHex = extractHex;
exports.RGBToHSL = RGBToHSL;
exports.HSLToRGB = HSLToRGB;
exports.adjustColor = adjustColor;
/**
 * Created by Johnson on 2017-04-02.
 */

/**
 * Extract numeric RGB values from a HTML compatible string (whitespace ignored)
 * @param {string} rgbString RGB string in the format "rgb(100,220,42)"
 * @returns {(object|null)} Either an object holding r,g,b properties, or null if not matched
 */
function extractRGB(rgbString) {
    var rgb = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(rgbString);
    if (rgb) {
        return {
            r: parseInt(rgb[1]),
            g: parseInt(rgb[2]),
            b: parseInt(rgb[3])
        };
    }
    return null;
}

/**
 * Extract numeric HSL values from a HTML compatible string (whitespace ignored)
 * @param {string} hslString HSL string in the format "hsl(310,12%,25%)"
 * @returns {(object|null)} Either an object holding h,s,l properties, or null if not matched
 */
function extractHSL(hslString) {
    var hsl = /hsl\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)%\s*,\s*([+-]?\d+(?:\.\d+)?)%\s*\)/.exec(hslString);
    if (hsl) {
        return {
            h: parseFloat(hsl[1]),
            s: parseFloat(hsl[2]),
            l: parseFloat(hsl[3])
        };
    }
    return null;
}

/**
 * Extract numeric RGB values from a HTML compatible hex string (whitespace ignored)
 * @param {string} hexString Hex string in the format "#ffaabc"
 * @returns {(object|null)} Either an object holding r,g,b properties, or null if not matched
 */
function extractHex(hexString) {
    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
    if (rgb) {
        return {
            r: parseInt(rgb[1], 16),
            g: parseInt(rgb[2], 16),
            b: parseInt(rgb[3], 16)
        };
    }
    return null;
}

/**
 * Convert an RGB object to HSL object, which are more intuitive to modify.
 * Adapted from https://github.com/mjackson/
 * @param {object} rgb RGB object holding r,g,b properties (each [0,255])
 * @returns {object} HSL object holding h,s,l properties (h [0,360], s,l [0,100])
 */
function RGBToHSL(rgb) {
    var r = void 0,
        g = void 0,
        b = void 0;
    var _ref = [rgb.r, rgb.g, rgb.b];
    r = _ref[0];
    g = _ref[1];
    b = _ref[2];

    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h = void 0,
        s = void 0,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                break;
        }
        h /= 6;
    }
    h *= 360;
    s *= 100;
    l *= 100;

    return rgb.hasOwnProperty("a") ? {
        h: h,
        s: s,
        l: l,
        a: rgb.a
    } : {
        h: h,
        s: s,
        l: l
    };
}

/**
 * Converts an HSL color value to RGB
 * Adapted from https://github.com/mjackson/
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * @param {object} hsl HSL object holding h,s,l properties (h [0,360], s,l [0,100])
 * @returns {object} RGB object holding r,g,b properties (each [0,255])
 */
function HSLToRGB(hsl) {
    var h = hsl.h,
        s = hsl.s,
        l = hsl.l;

    h /= 360;
    s /= 100;
    l /= 100;

    var r = void 0,
        g = void 0,
        b = void 0;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    return hsl.hasOwnProperty("a") ? {
        r: r,
        g: g,
        b: b,
        a: hsl.a
    } : {
        r: r,
        g: g,
        b: b
    };
}

/**
 * Adjust an existing color into a new color
 * @param color A color in RGB, hex, or HSL form
 * @param adjustment Object with h, s, l, and optionally a as properties for how much to modify them by (addition)
 */
function adjustColor(color, adjustment) {
    // convert everything to HSL
    var hsl = null;
    if (typeof color === "string") {
        // get the first non-null result
        hsl = extractHSL(color);
        if (hsl === null) {
            hsl = hsl || extractRGB(color);
            hsl = hsl || extractHex(color);
            // have an RGB value
            if (hsl) {
                hsl = RGBToHSL(hsl);
            }
        }
    } else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
        hsl = color;
    } else if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
        hsl = RGBToHSL(color);
    }

    // can't do it
    if (hsl === null) {
        return null;
    }
    hsl.h += adjustment.h || 0;
    hsl.s += adjustment.s || 0;
    hsl.l += adjustment.l || 0;
    if (adjustment.hasOwnProperty("a")) {
        return "hsla(" + hsl.h + "," + hsl.s + "%," + hsl.l + "%," + adjustment.a + ")";
    } else {
        return "hsl(" + hsl.h + "," + hsl.s + "%," + hsl.l + "%)";
    }
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.none = undefined;
exports.drawPoints = drawPoints;
exports.drawCircle = drawCircle;
exports.drawSpecificCurl = drawSpecificCurl;
exports.tracePoint = tracePoint;
exports.reverseDrawPoint = reverseDrawPoint;
exports.getSmoothControlPoint = getSmoothControlPoint;

var _point = __webpack_require__(0);

var _curve = __webpack_require__(1);

/**
 * Styling option to not show stroke or fill
 * @readonly
 * @type {string}
 */
var none = exports.none = "rgba(0,0,0,0)";

/**
 * Draw the path formed by the list of drawpoints
 * @param {Context2DTracked} ctx Context2D to render to, if it exists
 * @param {Object[]} points Ordered list of draw points, each with x and y
 */
function drawPoints(ctx) {
    for (var _len = arguments.length, points = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        points[_key - 1] = arguments[_key];
    }

    // given ctx and a list of points, draw points between them based on how many control points
    // are defined for each
    // does not begin a path or fill or stroke (just moves pen between the points)
    if (points.length < 1) {
        return;
    }
    var startPoint = points[0];
    // if null is passed through, just continue from last location
    if (startPoint) {
        if (startPoint === _point.breakPoint) {
            startPoint = points[1];
        }
        if (startPoint && startPoint.hasOwnProperty("x")) {
            ctx.moveTo(startPoint.x, startPoint.y);
        }
    }
    // for every point after
    for (var i = 1, len = points.length; i < len; ++i) {
        var p = points[i];
        // allow calls with nonexistent points so that different drawing modes can be
        // consolidated
        if (!p) {
            // console.log("don't have point #", i);
            continue;
        }
        if (p === _point.breakPoint) {
            ++i;
            if (i < points.length) {
                p = points[i];
                ctx.moveTo(p.x, p.y);
            }
        } else if (p.cp2 && p.cp1) {
            ctx.bezierCurveTo(p.cp1.x, p.cp1.y, p.cp2.x, p.cp2.y, p.x, p.y, p.traceOptions);
        } else if (p.cp1) {
            ctx.quadraticCurveTo(p.cp1.x, p.cp1.y, p.x, p.y, p.traceOptions);
        } else if (p.cp2) {
            ctx.quadraticCurveTo(p.cp2.x, p.cp2.y, p.x, p.y, p.traceOptions);
        } else if (p.hasOwnProperty("x")) {
            ctx.lineTo(p.x, p.y);
        }
    }
}

/**
 * Get the drawpoints for a circle
 * @param {object} center Point at the center of the circle
 * @param {number} radius Radius in cm
 * @returns {object[]} List of draw points for this circle (could be passed to guiMenuItem)
 */
function drawCircle(center, radius) {
    var stretch = 0.552284749831 * radius;
    var top = {
        x: center.x,
        y: center.y + radius
    };
    var right = {
        x: center.x + radius,
        y: center.y
    };
    var bot = {
        x: center.x,
        y: center.y - radius
    };
    var left = {
        x: center.x - radius,
        y: center.y
    };
    top.cp1 = {
        x: left.x,
        y: left.y + stretch
    };
    top.cp2 = {
        x: top.x - stretch,
        y: top.y
    };
    right.cp1 = {
        x: top.x + stretch,
        y: top.y
    };
    right.cp2 = {
        x: right.x,
        y: right.y + stretch
    };
    bot.cp1 = {
        x: right.x,
        y: right.y - stretch
    };
    bot.cp2 = {
        x: bot.x + stretch,
        y: bot.y
    };
    left.cp1 = {
        x: bot.x - stretch,
        y: bot.y
    };
    left.cp2 = {
        x: left.x,
        y: left.y - stretch
    };
    // doesn't actually matter in which order you draw them
    return [top, right, bot, left, top];
}

function drawSpecificCurl(left, center, right) {
    var p1 = (0, _point.extractPoint)(left);
    var p2 = (0, _point.extractPoint)(center);
    var p3 = (0, _point.extractPoint)(right);

    {
        var _left$t = left.t,
            t = _left$t === undefined ? 0.5 : _left$t,
            _left$deflection = left.deflection,
            deflection = _left$deflection === undefined ? 0.5 : _left$deflection;

        p2.cp1 = (0, _curve.simpleQuadratic)(p1, p2, t, deflection);
    }
    {
        var _right$t = right.t,
            _t = _right$t === undefined ? 0.5 : _right$t,
            _right$deflection = right.deflection,
            _deflection = _right$deflection === undefined ? 0.5 : _right$deflection;

        p3.cp1 = (0, _curve.simpleQuadratic)(p1, p2, _t, _deflection);
    }
    return [p1, p2, p3];
}

/**
 * Debug the curve going into a drawpoint. Use by wrapping a drawpoint with it when returning
 * to guiMenuItem.
 * @param {object} pt
 * @param {object} traceOptions Options for how to show the points
 * @returns {*}
 */
function tracePoint(pt, options) {
    if (!options) {
        options = { radius: 1 };
    } else if (typeof options === "number") {
        // convenience for defining radius of trace point
        options = { radius: options };
    }
    pt.traceOptions = { point: options };
    return pt;
}

/**
 * Given a curve defined by (start, end), return a draw point such that (end, returned point) looks identical,
 * but travels in the opposite direction.
 * @param start
 * @param end
 * @returns {*}
 */
function reverseDrawPoint(start, end) {
    if (!start || !end) {
        return start;
    }
    return {
        x: start.x,
        y: start.y,
        cp1: (0, _point.clone)(end.cp2),
        cp2: (0, _point.clone)(end.cp1)
    };
}

/**
 * For a bezier curve point, get a control point on the other side of the point so that the
 * curve is smooth.
 * @param {point} pt End point of a bezier curve (must have 2nd control point)
 * @param {number} scaleValue How much back to extend the continuing control point.
 * A value of 1 produces a symmetric curve.
 * @returns {{x, y}|{x: number, y: number}|*} Continuing control point
 */
function getSmoothControlPoint(pt, scaleValue) {
    if (pt.hasOwnProperty("cp2") === false) {
        throw new Error("point has no second control point; can't get smooth control point");
    }
    return (0, _point.scale)(pt, pt.cp2, -scaleValue);
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(3);

Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _util[key];
    }
  });
});

var _colour = __webpack_require__(4);

Object.keys(_colour).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _colour[key];
    }
  });
});

var _numeric = __webpack_require__(2);

Object.keys(_numeric).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _numeric[key];
    }
  });
});

var _point = __webpack_require__(0);

Object.keys(_point).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _point[key];
    }
  });
});

var _curve = __webpack_require__(1);

Object.keys(_curve).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _curve[key];
    }
  });
});

var _draw = __webpack_require__(5);

Object.keys(_draw).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _draw[key];
    }
  });
});

/***/ })
/******/ ]);
});