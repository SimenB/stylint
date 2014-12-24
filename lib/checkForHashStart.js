// check if we're starting a hash
var hashStarting = /\{$/;

module.exports = function checkForHashStart( line ) {
    // ex colorsHash = {
    if ( hashStarting.test(line) && line.indexOf('=') !== -1 ) {
        return true;
    }
    else {
        return false;
    }
}