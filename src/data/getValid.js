var fs = require('fs');

module.exports = function getValidJSON() {
    'use strict';
    return JSON.parse( fs.readFileSync(__dirname + '/valid.json') );
}