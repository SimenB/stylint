// check if we're ending a hash
var hashEnding = /\}$/;

module.exports = function checkForHashEnd( line, areWeInAHash ) {
    // ex }, but only if we've already establish that we're not in a hash
    if ( hashEnding.test(line) && areWeInAHash === true ) {
        return true;
    }
    else {
        return false;
    }
}