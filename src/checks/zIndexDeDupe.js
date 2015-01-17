'use strict';

// check for z-index values that are duplicated elsewhere
module.exports = function deDupeZIndex( line ) {
    if ( typeof line !== 'string' ) { return; }

    var res = false,
        // only split the line if needed, ie, if z-index is on the line
        arr = line.split(/[\s\t,:]/);

        // remove white space,
        arr = arr.filter(
            function( str ) {
                return str.length > 0;
            }
        );

    // the most basic of checks, throw warning if zindex duplicated elsewhere
    if ( line.indexOf('z-index') !== -1 ) {

        this.zCache.forEach(function( val, i ) {
            if ( this.zCache[ i ] === arr[ arr.length - 1 ] ) {
                res = true;
            }
        }.bind( this ));

        this.zCache.push( arr[ arr.length - 1 ] );
    }

    return res;
}