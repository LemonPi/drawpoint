/**
 * Created by Johnson on 2017-04-02.
 */

/**
 * Convert radians to degrees
 * @param radian
 * @returns {number}
 */
export function deg(radian) {
    return 180 * radian / Math.PI;
}

/**
 * Convert degrees to radians
 * @param degree
 * @returns {number}
 */
export function rad(degree) {
    return degree * Math.PI / 180;
}

/**
 * Clamp a number between a minimum and maximum value
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number} Clamped number
 */
export function clamp(num, min, max) {
    return num < min ? min : num > max ? max : num;
}

/**
 * Round a number to a fixed number of decimals
 * @param {number} num Number to round
 * @param {number} numDecimals Number of decimals
 * @returns {number}
 */
export function roundToDec(num, numDecimals) {
    return parseFloat(num.toFixed(numDecimals));
}
