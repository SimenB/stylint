// checks for use of @block when declaring blocks
const
    eq = /( =)|( \=\n)/,
    eqEnd = /=$|=\s$/,
    hash = /\{$/;

module.exports = function checkBlockStyle( line ) {
    'use strict';
    if ( typeof line === 'undefined' ) { return; }

    // if = is present on line and not a block var or hash
    if ( eq.test(line) &&
        line.indexOf('@block') === -1 &&
        !hash.test(line) ) {

        // if = at end of line, but no value or @block
        if ( eqEnd.test(line) ) {
            return false;
        }
    }
    else if ( eq.test(line) &&
        line.indexOf('@block') !== -1 &&
        !hash.test(line) &&
        !eqEnd.test(line) ) {
        // if = is present, @block is present, not a hash, and no = at the end
        return true;
    }
}