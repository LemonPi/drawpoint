/**
 * Created by Johnson on 2017-04-02.
 */

// noinspection JSUnusedGlobalSymbols
/**
 * Convert radians to degrees
 * @param radian
 * @returns {number}
 */
export function deg(radian: number): number {
    return 180 * radian / Math.PI;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Convert degrees to radians
 * @param degree
 * @returns {number}
 */
export function rad(degree: number): number {
    return degree * Math.PI / 180;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Unwrap a radian to its equivalent form between [-PI, PI]
 * @param rad
 */
export function unwrapRad(rad: number): number {
    while (rad > Math.PI) {
        rad -= 2 * Math.PI;
    }
    while (rad < -Math.PI) {
        rad += 2 * Math.PI;
    }
    return rad;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Clamp a number between a minimum and maximum value
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number} Clamped number
 */
export function clamp(num: number, min: number, max: number): number {
    return num < min ? min : num > max ? max : num;
}

/**
 * Round a number to a fixed number of decimals
 * @param {number} num Number to round
 * @param {number} numDecimals Number of decimals
 * @returns {number}
 */
export function roundToDec(num: number, numDecimals: number): number {
    return parseFloat(num.toFixed(numDecimals));
}
