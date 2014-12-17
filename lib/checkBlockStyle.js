// checks for use of @block when declaring blocks
var dolla = /^\$/,
    eq = /( =)|( \=\n)/,
    eqEnd = /=$|=\s$/,   // /( = )|( \=\n)/,
    hash = /\{$/;

module.exports = function checkBlockStyle( line ) {
    var arr = line.split(' ');
    
    // if = is present on line and not a block var or hash
    if ( eq.test(line) 
        && line.indexOf('@block') === -1 
        && !hash.test(line) ) {
        // console.log(line.split(' '));
        if ( eqEnd.test(line) ) {
            return false;
        }
        else {
            return true;
        }
    }
}