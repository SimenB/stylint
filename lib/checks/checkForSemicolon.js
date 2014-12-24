// check for semicolons
module.exports = function checkForSemicolons( line ) {
    if ( line.indexOf(';') !== -1 ) {
        return true;
    }
    else {
        return false;
    }
}