/**
 * Created by johnson on 10.05.17.
 */
import {DrawPoint} from "./point";

export function clone(obj) {
    if (obj) {
        return JSON.parse(JSON.stringify(obj));
    } else {
        return obj;
    }
}

// noinspection JSUnusedGlobalSymbols
/**
 * Define a draw point if it doesn't exist already
 * @param {object} ex Export holding draw points
 * @param {string} drawPointName Name of the location
 * @param {object} definition Object holding x, y, cp1, and cp2
 */
export function fillerDefinition(ex, drawPointName, definition: DrawPoint | {} = {}) {
    if (ex.hasOwnProperty(drawPointName)) {
        return;
    }
    ex[drawPointName] = definition;
}
