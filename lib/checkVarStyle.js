// check that $ is used when declaring vars
var eqEnd = /=$|=\s$/,
    hash = /\{$/,
    varCheck = /\$\w+/;

module.exports = function checkVarStyle( line ) {
    // check if = is present on line at all
    if ( line.indexOf(' = ') !== -1 ) {
        // if so, make sure it's not a block or hash
        if ( line.indexOf('@block') === -1
            && !hash.test(line)
            && !eqEnd.test(line) ) {

            // at this point assume this line is defining a var and we check that the line starts with a $
            // and that it doesn't end with = (meaning its a block)
            if ( varCheck.test( line ) ) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    // if not defining a var, we might be using in a mixin or if block
    // else if ( arr[0].indexOf('(') !== -1 ) {
    //     if ( varCheck.test( line ) ) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }
}