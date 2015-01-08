const fs = require('fs');

module.exports = function getValidCSSJSON() {
    'use strict';
    return JSON.parse( fs.readFileSync(__dirname + '/checks/validCSS.json') );
}