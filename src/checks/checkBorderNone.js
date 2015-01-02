// checks for border none
module.exports = function checkBorderNone( line ) {
    'use strict';
    if ( typeof line === 'undefined' ) { return; }

    if ( line.indexOf('border none') !== -1 ) {
        return true;
    }
    else if (line.indexOf('border 0') !== -1) {
        return false;
    }
}