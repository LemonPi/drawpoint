/**
 * Created by johnson on 10.05.17.
 */
const dp = require("../dist/drawpoint");
const assert = require("assert");
const seedrandom = require("seedrandom");

if (process && process.argv[3]) {
    seedrandom(process.argv[3], {global: true});
}

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

describe("drawpoint", function () {
    importTest("color", "./color");
    importTest("numeric", "./numeric");
    importTest("point", "./point");
    importTest("curve", "./curve");
});
