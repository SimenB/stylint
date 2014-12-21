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

        // if = at end of line, but no value or @block
        if ( eqEnd.test(line) ) {
            return false;
        }
    }
    else if ( eq.test(line) 
        && line.indexOf('@block') !== -1 
        && !hash.test(line)
        && !eqEnd.test(line) ) {
        // if = is present, @block is present, not a hash, and no = at the end
        return true;
    }
}