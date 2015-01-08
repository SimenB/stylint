const leadingZero = /^(0\.)+/;

// check for leading 0
module.exports = function hasLeadingZero( line, arr ) {
    'use strict';
    if ( typeof line === 'undefined' ) { return; }
    var zeroFound = false;

    // remove whitespace from array
    arr = arr.filter(function( str ) {
        return str.length > 0;
    });

    // return true if leading zero found and not used as part of range
    if ( line.indexOf('0.') !== -1 && line.indexOf('0..') === -1) {
        for ( var i = 0; i < arr.length; i++ ) {
            if ( leadingZero.test( arr[i] ) ) {
                zeroFound = true;
            }
        }
    }

    if ( zeroFound ) {
        return true;
    }
    else {
        return false;
    }

}