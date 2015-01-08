module.exports = function getValidCSSJSON() {
    'use strict';
    return JSON.parse( app.fs.readFileSync(__dirname + '/checks/validCSS.json') );
}