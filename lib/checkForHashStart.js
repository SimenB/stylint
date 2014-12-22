// check if we're starting a hash
module.exports = function checkForHashStart( line ) {
    var hashStarting = /\{$/;
        
    // ex colorsHash = {
    if ( hashStarting.test(line) && line.indexOf('=') !== -1 ) {
        return true;
    }
    else {
        return false;
    }
}