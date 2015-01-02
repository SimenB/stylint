// check for semicolons
module.exports = function checkForSemicolons( line ) {
    'use strict';
    if ( typeof line === 'undefined' ) { return; }

    if ( line.indexOf(';') !== -1 ) {
        return true;
    }
    else {
        return false;
    }
}