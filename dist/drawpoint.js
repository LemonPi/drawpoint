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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.point = point;
exports.makePoint = makePoint;
exports.add = add;
exports.diff = diff;
exports.norm = norm;
exports.angle = angle;
exports.scale = scale;
exports.getUnitVector = getUnitVector;
exports.getPerpendicularVector = getPerpendicularVector;
exports.extractPoint = extractPoint;
exports.reflect = reflect;
exports.adjust = adjust;
exports.adjustPoints = adjustPoints;
exports.scalePoints = scalePoints;
exports.rotatePoints = rotatePoints;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function point(x, y) {
    return {
        x: x,
        y: y
    };
}

/**
 * Make a new point where each dimension is the result of applying a function to
 * the corresponding dimension of a list of control points.
 * @param func
 * @param cps
 * @returns {{x, y}|*}
 */
function makePoint(func) {
    for (var _len = arguments.length, cps = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        cps[_key - 1] = arguments[_key];
    }

    return point(func.apply(undefined, _toConsumableArray(cps.map(function (cp) {
        return cp.x;
    }))), func.apply(undefined, _toConsumableArray(cps.map(function (cp) {
        return cp.y;
    }))));
}

var origin = exports.origin = Object.freeze(point(0, 0));

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

/**
 * Treat points as vectors and add them, optionally after scaling p2
 * @param p1
 * @param p2
 * @param scaleBy
 * @returns {{x: *, y: *}}
 */
function add(p1, p2) {
    var scaleBy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    return makePoint(function (pp1, pp2) {
        return pp1 + pp2 * scaleBy;
    }, p1, p2);
}

/**
 * Get the difference of 2 draw points p2 - p1; conceptually a vector pointing p1 -> p2
 * @param {{x:number, y:number}} p1 First point
 * @param {{x:number, y:number}} p2 Second point
 * @returns {{x: number, y: number}}
 */
function diff(p1, p2) {
    return makePoint(function (pp1, pp2) {
        return pp2 - pp1;
    }, p1, p2);
}

/**
 * Get the magnitude of a vector
 * @param vec
 * @returns {number} Euclidean (L^2) norm of vec
 */
function norm(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

/**
 * Get the angle of a vector in radians
 * @param vec
 * @returns {number} Angle in radians
 */
function angle(vec) {
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
function scale(pt, scaleBy) {
    var referencePt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : origin;

    return add(referencePt, diff(referencePt, pt), scaleBy);
}

/**
 * Relative to 0,0, get the direction a draw point/vector is pointing at
 * @param vec
 * @returns {{x: number, y: number}}
 */
function getUnitVector(vec) {
    var magnitude = norm(vec);
    return makePoint(function (v) {
        return v / magnitude;
    }, vec);
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
 * Remove any extra information from a point down to just x,y
 */
function extractPoint(pt) {
    return point(pt.x, pt.y);
}

/**
 * Remove any extra information from a point and reflect across y axis
 */
function reflect(pt) {
    var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
    var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    if (!pt) {
        return pt;
    }
    var c = void 0,
        cm = void 0;

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

    return point(2 * c - pt.x, 2 * cm - pt.y + 2 * b);
}

/**
 * Shift a draw point and its control points
 * @param {object} pt
 * @param {number} dx
 * @param {number} dy
 * @returns {object}
 */
function adjust(pt, dx, dy) {
    if (!pt) {
        return pt;
    }
    // return a point with x and y adjusted by dx and dy respectively
    var movedPoint = point(pt.x + dx, pt.y + dy);
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
function adjustPoints(dx, dy) {
    var shiftedPoints = [];

    for (var _len2 = arguments.length, points = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        points[_key2 - 2] = arguments[_key2];
    }

    points.forEach(function (pt) {
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
function scalePoints(center, scaleBy) {
    for (var _len3 = arguments.length, points = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        points[_key3 - 2] = arguments[_key3];
    }

    points.forEach(function (pt) {
        if (!pt || pt.hasOwnProperty("x") === false) {
            return;
        }

        var _scale = scale(pt, scaleBy, center),
            x = _scale.x,
            y = _scale.y;

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
function rotatePoints(pivot, rad) {
    var cos = Math.cos(rad),
        sin = Math.sin(rad);

    for (var _len4 = arguments.length, points = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        points[_key4 - 2] = arguments[_key4];
    }

    points.forEach(function (pt) {
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
    var pointDiff = diff(pivot, pt);
    var dx = pointDiff.x * cos - pointDiff.y * sin;
    var dy = pointDiff.x * sin + pointDiff.y * cos;
    pt.x = pivot.x + dx;
    pt.y = pivot.y + dy;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.applyToCurve = applyToCurve;
exports.getPointOnCurve = getPointOnCurve;
exports.getPointOnLine = getPointOnLine;
exports.splitCurve = splitCurve;
exports.interpolateCurve = interpolateCurve;
exports.simpleQuadratic = simpleQuadratic;
exports.elevateDegree = elevateDegree;
exports.getCubicControlPoints = getCubicControlPoints;
exports.transformCurve = transformCurve;

var _point = __webpack_require__(0);

var _numeric = __webpack_require__(2);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Created by johnson on 11.05.17.
                                                                                                                                                                                                     */

function applyToCurve(p1, p2, _ref) {
    var linear = _ref.linear,
        quadratic = _ref.quadratic,
        cubic = _ref.cubic;

    var ep1 = (0, _point.extractPoint)(p1);
    var ep2 = (0, _point.extractPoint)(p2);
    if (p2.cp1 && p2.cp2) {
        return cubic(ep1, p2.cp1, p2.cp2, ep2);
    }
    var cp = p2.cp1 || p2.cp2;
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
function getPointOnCurve(t, p1, p2) {
    return applyToCurve(p1, p2, {
        linear: function linear() {
            for (var _len = arguments.length, cps = Array(_len), _key = 0; _key < _len; _key++) {
                cps[_key] = arguments[_key];
            }

            return getPointOnLine.apply(undefined, [t].concat(cps));
        },
        quadratic: function quadratic() {
            for (var _len2 = arguments.length, cps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                cps[_key2] = arguments[_key2];
            }

            return _point.makePoint.apply(undefined, [getQuadraticValue.bind(null, t)].concat(cps));
        },
        cubic: function cubic() {
            for (var _len3 = arguments.length, cps = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                cps[_key3] = arguments[_key3];
            }

            return _point.makePoint.apply(undefined, [getCubicValue.bind(null, t)].concat(cps));
        }
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
function getPointOnLine(t, p1, p2) {
    return (0, _point.makePoint)(getLinearValue.bind(null, t), p1, p2);
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
    return p1 * (1 - t) * (1 - t) * (1 - t) + 3 * cp1 * (1 - t) * (1 - t) * t + 3 * cp2 * (1 - t) * t * t + p2 * t * t * t;
}

function splitBezier(t, p1, cp1, cp2, p2) {
    // split a cubic cubic based on De Casteljau, t is between [0,1]
    // just a series of linear interpolations
    var E = getPointOnLine(t, p1, cp1);
    var F = getPointOnLine(t, cp1, cp2);
    var G = getPointOnLine(t, cp2, p2);
    var H = getPointOnLine(t, E, F);
    var J = getPointOnLine(t, F, G);
    var K = getPointOnLine(t, H, J);

    var left = {
        p1: p1,
        p2: K
    };
    left.p2.cp1 = E;
    left.p2.cp2 = H;

    var right = {
        p1: (0, _point.extractPoint)(K),
        p2: p2
    };
    right.p2.cp1 = J;
    right.p2.cp2 = G;

    return {
        left: left,
        right: right
    };
}

function splitQuadratic(t, p1, cp, p2) {
    // split a quadratic cubic based on De Casteljau, t is between [0,1]
    var D = getPointOnLine(t, p1, cp);
    var E = getPointOnLine(t, cp, p2);
    var F = getPointOnLine(t, D, E);

    var left = {
        p1: p1,
        p2: F
    };
    left.p2.cp1 = D;
    var right = {
        p1: (0, _point.extractPoint)(F),
        p2: p2
    };
    right.p2.cp1 = E;

    return {
        left: left,
        right: right
    };
}

function splitLinear(t, p1, p2) {
    // split a linear linear
    var C = getPointOnLine(t, p1, p2);
    return {
        left: {
            p1: p1,
            p2: C
        },
        right: {
            p1: C,
            p2: p2
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
function splitCurve(t, p1, p2) {
    // split either a quadratic or cubic curve depending on number of control points on
    // the end point
    return applyToCurve(p1, p2, {
        linear: splitLinear.bind(null, t),
        quadratic: splitQuadratic.bind(null, t),
        cubic: splitBezier.bind(null, t)
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

    var discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return [];
    } else {
        return [(-b + Math.sqrt(discriminant)) / (2 * a), (-b - Math.sqrt(discriminant)) / (2 * a)];
    }
}

function interpolateQuadratic(p1, cp1, p2, p) {
    var a = p1 - 2 * cp1 + p2;
    var b = 2 * (cp1 - p1);
    var c = p1 - p;

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

function interpolateCubic(p1, cp1, cp2, p2, p) {
    // and rewrite from [a(1-t)^3 + 3bt(1-t)^2 + 3c(1-t)t^2 + dt^3] form
    p1 -= p;
    cp1 -= p;
    cp2 -= p;
    p2 -= p;

    // to [t^3 + at^2 + bt + c] form:
    var d = -p1 + 3 * cp1 - 3 * cp2 + p2;
    var a = (3 * p1 - 6 * cp1 + 3 * cp2) / d;
    var b = (-3 * p1 + 3 * cp1) / d;
    var c = p1 / d;

    return solveCubicEquation(a, b, c).map(function (t) {
        return (0, _numeric.roundToDec)(t, 4);
    });
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
function interpolateCurve(p1, p2, betweenPoint) {
    var knownDim = void 0;
    if (betweenPoint.x === null) {
        knownDim = "y";
    } else if (betweenPoint.y === null) {
        knownDim = "x";
    } else {
        return [];
    }

    var ts = applyToCurve(p1, p2, {
        linear: function linear() {
            for (var _len4 = arguments.length, cps = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                cps[_key4] = arguments[_key4];
            }

            return interpolateLinear.apply(undefined, _toConsumableArray(cps.map(function (cp) {
                return cp[knownDim];
            })).concat([betweenPoint[knownDim]]));
        },
        quadratic: function quadratic() {
            for (var _len5 = arguments.length, cps = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                cps[_key5] = arguments[_key5];
            }

            return interpolateQuadratic.apply(undefined, _toConsumableArray(cps.map(function (cp) {
                return cp[knownDim];
            })).concat([betweenPoint[knownDim]]));
        },
        cubic: function cubic() {
            for (var _len6 = arguments.length, cps = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                cps[_key6] = arguments[_key6];
            }

            return interpolateCubic.apply(undefined, _toConsumableArray(cps.map(function (cp) {
                return cp[knownDim];
            })).concat([betweenPoint[knownDim]]));
        }
    }).filter(function (t) {
        // solving cubic equations is not very numerically stable...
        t = (0, _numeric.roundToDec)(t, 3);
        return t >= 0 && t <= 1;
    });

    return ts.map(function (t) {
        var p = getPointOnCurve(t, p1, p2);
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
function simpleQuadratic(p1, p2) {
    var t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var deflection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    var cp1 = getPointOnLine(t, p1, p2);
    return (0, _point.add)(cp1, (0, _point.getPerpendicularVector)((0, _point.diff)(p1, p2)), deflection);
}

/**
 * Increase the degree of a cubic curve (e.g. quadratic to cubic) without changing its shape
 * @param p1 Starting point of the curve
 * @param p2 Ending point of the curve and holds the other control points
 */
function elevateDegree(p1, p2) {
    var cps = [p1];
    for (var cp in p2) {
        if (cp.startsWith("cp") && p2.hasOwnProperty(cp)) {
            cps.push(p2[cp]);
        }
    }
    cps.push((0, _point.extractPoint)(p2));

    var newEndPoint = (0, _point.extractPoint)(p2);
    // see https://www.cs.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/Bezier/bezier-elev.html

    var _loop = function _loop(i, newDegree) {
        var coefficient = i / newDegree;

        newEndPoint["cp" + i] = (0, _point.makePoint)(function (cpsPrev, cps) {
            return coefficient * cpsPrev + (1 - coefficient) * cps;
        }, cps[i - 1], cps[i]);
    };

    for (var i = 1, newDegree = cps.length; i < newDegree; ++i) {
        _loop(i, newDegree);
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
function getCubicControlPoints(p1, p2) {
    return applyToCurve(p1, p2, {
        linear: function linear() {
            var newEnd = elevateDegree(p1, elevateDegree(p1, p2));
            return [newEnd.cp1, newEnd.cp2];
        },
        quadratic: function quadratic() {
            var newEnd = elevateDegree(p1, p2);
            return [newEnd.cp1, newEnd.cp2];
        },

        cubic: function cubic() {
            return [p2.cp1, p2.cp2];
        }
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
function transformCurve(t, p1, initP2, endP2) {
    if (!initP2) {
        return endP2;
    }
    if (!endP2) {
        return initP2;
    }

    var _getCubicControlPoint = getCubicControlPoints(p1, initP2),
        _getCubicControlPoint2 = _slicedToArray(_getCubicControlPoint, 2),
        initCp1 = _getCubicControlPoint2[0],
        initCp2 = _getCubicControlPoint2[1];

    var _getCubicControlPoint3 = getCubicControlPoints(p1, endP2),
        _getCubicControlPoint4 = _slicedToArray(_getCubicControlPoint3, 2),
        endCp1 = _getCubicControlPoint4[0],
        endCp2 = _getCubicControlPoint4[1];

    var newEnd = getPointOnLine(t, initP2, endP2);
    newEnd.cp1 = getPointOnLine(t, initCp1, endCp1);
    newEnd.cp2 = getPointOnLine(t, initCp2, endCp2);
    return newEnd;
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
exports.unwrapRad = unwrapRad;
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
 * Unwrap a radian to its equivalent form between [-PI, PI]
 * @param rad
 */
function unwrapRad(rad) {
    while (rad > Math.PI) {
        rad -= 2 * Math.PI;
    }
    while (rad < -Math.PI) {
        rad += 2 * Math.PI;
    }
    return rad;
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
 * @param {object} options Options for how to show the points
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
 * For a cubic curve point, get a control point on the other side of the point so that the
 * curve is smooth.
 * @param {point} pt End point of a cubic curve (must have 2nd control point)
 * @param {number} scaleBy How much back to extend the continuing control point.
 * A value of 1 produces a symmetric curve.
 * @returns {{x, y}|{x: number, y: number}|*} Continuing control point
 */
function getSmoothControlPoint(pt, scaleBy) {
    if (pt.hasOwnProperty("cp2") === false) {
        throw new Error("point has no second control point; can't get smooth control point");
    }
    return (0, _point.scale)(pt.cp2, -scaleBy, pt);
}

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(4);

Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _util[key];
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

var _draw = __webpack_require__(3);

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
//# sourceMappingURL=drawpoint.js.map