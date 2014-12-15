// checks for use of @block when declaring blocks
var dolla = /^\$/,
    eq = /( =)|( \=\n)/,
    eqEnd = /=$|=\s$/,   // /( = )|( \=\n)/,
    hash = /\{$/;

module.exports = function checkBlockStyle(line) {
    var arr = line.split(' ');
    // console.log(line.split(' '));
    // console.log('index of " = ": ', line.indexOf(' = '));
    // console.log('index of " =newline": ', line.indexOf(' =\n'));
    // if = is present on line and not a block var or hash
    if (eq.test(line) && line.indexOf('@block') === -1 && !hash.test(line)) {
        // console.log(line.split(' '));
        if (eqEnd.test(line)) {
            return false;
        }
        else {
            return true;
        }
        // check for newline after = declaration
        // if (line.indexOf(' = \n') !== -1 || line.indexOf(' =\n') !== -1) {
        //     // we're now assuming this is a block var (or just a var that was never finished)
        //     console.log(line);
        // }
        // // at this point assume this line is defining a var and we check that the line starts with a $
        // if (dolla.test(line)) {
        //     return true;
        // }
        // else {
        //     return false;
        // }
    }
}