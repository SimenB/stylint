// check if we're starting a hash
var openBracket = /\{$/,
    closeBracket = /\}$/,
    interpolation = /(\S})$/;

module.exports = function checkForBrackets( line, areWeInAHash ) {
    // ex .someClass {
    if ( openBracket.test(line) && line.indexOf('=') === -1 ) {
        return true;
    }
    else if ( closeBracket.test(line) && !areWeInAHash && !interpolation.test(line) ) {
        return true;
    }
    // no brackets
    else {
        return false;
    }
}