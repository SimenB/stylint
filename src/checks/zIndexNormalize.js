// check for z-index values that aren't normalized
module.exports = function normalizeZIndex( line ) {
    'use strict';
    if ( typeof line === 'undefined' ) {
        return;
    }

    var arr = line.split(/[\s\t,:]/),
        res, zIndexValue;

    // remove white space
    arr = arr.filter(
        function( str ) {
            return str.length > 0;
        }
    );

    // the most basic of checks, throw warning if zindex value not normalized
    if ( line.indexOf( 'z-index' ) !== -1 ) {
        if ( arr[ arr.length - 1 ] % this.config.zIndexNormalize !== 0 ) {
            return true;
        }
        else {
            return false;
        }
    }
}