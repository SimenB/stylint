'use strict';

const leadingZero = /( |,)(0\.)+|(^0\.)+/;

// check for leading 0
module.exports = function hasLeadingZero( line, arr ) {
    if ( typeof line !== 'string' ) { return; }
    let zeroFound = false;

    // remove whitespace from array
    arr = arr.filter(function( str ) {
        return str.length > 0;
    });

    // return true if leading zero found and not used as part of range
    if ( line.indexOf('0.') !== -1 && line.indexOf('0..') === -1) {
        // console.log( arr );
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