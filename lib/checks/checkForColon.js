// check for colons
module.exports = function checkForColon( line, areWeInAHash ) {
    if ( areWeInAHash === false && line.indexOf(': ') !== -1 ) {
        return true;
    }
    else {
        return false;
    }
}