// check if we're ending a hash
const hashEnding = /^\}/;

module.exports = function checkForHashEnd( line, areWeInAHash ) {
    'use strict';
    if ( typeof areWeInAHash === 'undefined' || typeof line === 'undefined' ) { return; }

    // ex }, but only if we've already establish that we're in a hash'
    if ( hashEnding.test(line) && areWeInAHash ) {
        return true;
    }
    else {
        return false;
    }
}