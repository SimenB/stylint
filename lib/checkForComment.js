// check for line comment on the line
module.exports = function checkForComment( line ) {
    var hasComment = /(\/\/)/;
    
    // ex }, but only if we've already establish that we're not in a hash
    if ( hasComment.test(line) ) {
        return true;
    }
    else {
        return false;
    }
}