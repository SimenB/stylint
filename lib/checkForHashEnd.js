// check if we're ending a hash
var hashEnding = /\}$/;

module.exports = function checkForHashEnd( line ) {
    // ex }
    if ( hashEnding.test(line) ) {
        return true;
    }
}