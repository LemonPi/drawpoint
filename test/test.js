/**
 * Created by johnson on 10.05.17.
 */
const dp         = require('../dist/drawpoint');
const assert     = require('assert');
const seedrandom = require('seedrandom');

if (process && process.argv[3]) {
    seedrandom(process.argv[3], {global: true});
} else {
    const seed = new Date().getTime().toString();
    seedrandom(seed, {global: true});
    console.log('seed (string): ', seed);
}

function importTest(name, path) {
    describe(name, function() {
        require(path);
    });
}

describe('drawpoint', function() {
    importTest('numeric', './numeric');
    importTest('point', './point');
    importTest('curve', './curve');
});
