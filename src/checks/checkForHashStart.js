// check if we're starting a hash
const hashStarting = /\{$/;

module.exports = function checkForHashStart( line ) {
    'use strict';
    if ( typeof line === 'undefined' ) { return; }

    // ex colorsHash = {
    if ( hashStarting.test(line) && line.indexOf('=') !== -1 ) {
        return true;
    }
    else {
        return false;
    }
}