/**
 * Created by johnson on 10.05.17.
 */

export function clone(obj) {
    if (obj) {
        return JSON.parse(JSON.stringify(obj));
    } else {
        return obj;
    }
}