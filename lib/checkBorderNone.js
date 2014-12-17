// checks for border none
module.exports = function checkBorderNone( line ) {
    if ( line.indexOf('border none') !== -1 ) {
        return true;
    }
}