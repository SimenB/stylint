// check for line comment on the line
const hasComment = /(\/\/)/;

module.exports = function checkForComment( line ) {
    'use strict';
    if ( typeof line === 'undefined' ) { return; }

    // ex }, but only if we've already establish that we're not in a hash
    if ( hasComment.test(line) ) {
        return true;
    }
    else {
        return false;
    }
}