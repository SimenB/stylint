// check for colons
module.exports = function checkForColon( line, areWeInAHash ) {
    'use strict';
    if ( typeof areWeInAHash === 'undefined' || typeof line === 'undefined' ) { return; }

    if ( areWeInAHash === false && line.indexOf(': ') !== -1 ) {
        return true;
    }
    else {
        return false;
    }
}