// checks for $ before variables
var dolla = /(\$var)/,
    eq = /( =)|( \=\n)/,
    eqEnd = /=$|=\s$/,
    hash = /\{$/;

module.exports = function checkVarStyle( line ) {
    // console.log( line.split(' ') )
    // if = is present on line and not a block var or hash
    if ( eq.test(line) 
        && line.indexOf('@block') === -1 
        && !hash.test(line) 
        && !eqEnd.test(line) ) {
        // at this point assume this line is defining a var and we check that the line starts with a $
        // and that it doesn't end with = (meaning its a block)
        if ( dolla.test(line) ) {
            return true;
        }
        else {
            return false;
        }
    }
}