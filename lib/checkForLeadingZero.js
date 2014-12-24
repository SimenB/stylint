// check for leading 0
module.exports = function hasLeadingZero( line ) {
    // return false if 0px is found
    if ( line.indexOf('0.') !== -1 ) {
        return true;
    }
    else {
        return false;
    }
}