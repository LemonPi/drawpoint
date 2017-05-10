/**
 * Created by Johnson on 2017-04-02.
 */

/**
 * Extract numeric RGB values from a HTML compatible string (whitespace ignored)
 * @param {string} rgbString RGB string in the format "rgb(100,220,42)"
 * @returns {(object|null)} Either an object holding r,g,b properties, or null if not matched
 */
export function extractRGB(rgbString) {
    const rgb = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(rgbString);
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
export function extractHSL(hslString) {
    const hsl = /hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/.exec(hslString);
    if (hsl) {
        return {
            h: parseInt(hsl[1]),
            s: parseInt(hsl[2]),
            l: parseInt(hsl[3]),
        };
    }
    return null;
}

/**
 * Extract numeric RGB values from a HTML compatible hex string (whitespace ignored)
 * @param {string} hexString Hex string in the format "#ffaabc"
 * @returns {(object|null)} Either an object holding r,g,b properties, or null if not matched
 */
export function extractHex(hexString) {
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
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
export function RGBToHSL(rgb) {
    let r, g, b;
    [r, g, b] = [rgb.r, rgb.g, rgb.b];
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0;  // achromatic
    } else {
        const d = max - min;
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
            h,
            s,
            l,
            a: rgb.a
        } : {
            h,
            s,
            l
        };
}

/**
 * Adjust an existing color into a new color
 * @param color A color in RGB, hex, or HSL form
 * @param adjustment Object with H, S, L, and optionally A as properties
 */
export function adjustColor(color, adjustment) {
    // convert everything to HSL
    let hsl = null;
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
    } else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") &&
               color.hasOwnProperty("l")) {
        hsl = color;
    } else if (color.hasOwnProperty("r") && color.hasOwnProperty("g") &&
               color.hasOwnProperty("b")) {
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
        return `hsla(${hsl.h.toFixed(1)},${hsl.s.toFixed(1)}%,${hsl.l.toFixed(1)}%,${adjustment.a.toFixed(
            2)})`;
    } else {
        return `hsl(${hsl.h.toFixed(1)},${hsl.s.toFixed(1)}%,${hsl.l.toFixed(1)}%)`;
    }
}
