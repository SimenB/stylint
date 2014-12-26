// check if we're ending a hash
var hashEnding = /^\}/;

module.exports = function checkForHashEnd( line, areWeInAHash ) {
    // ex }, but only if we've already establish that we're in a hash'
    if ( hashEnding.test(line) && areWeInAHash ) {
        return true;
    }
    else {
        return false;
    }
}