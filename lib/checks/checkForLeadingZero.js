// check for leading 0
module.exports = function hasLeadingZero( line ) {
    if ( typeof line === 'undefined' ) { return; }

    // return true if leading zero found and not used as part of range
    if ( line.indexOf('0.') !== -1 && line.indexOf('0..') === -1) {
        return true;
    }
    else {
        return false;
    }
}