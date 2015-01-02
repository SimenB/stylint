// check for line comment on the line
const
    hasComment = /(\/\/)/,
    startWithLineComment = /(^\/\/)/;

module.exports = function checkForStart( line ) {
    'use strict';
    if ( typeof line === 'undefined' ) { return; }

    if ( hasComment.test(line) ) {
        // ex }, but only if we've already establish that we're not in a hash
        if ( startWithLineComment.test(line.trim()) ) {
            return true;
        }
        else {
            return false;
        }
    }
}