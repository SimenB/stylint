// check if we're starting a hash
var openBracket = /\{$/,
    closeBracket = /\}$/;

module.exports = function checkForBrackets( line, areWeInAHash ) {
    // ex .someClass {
    if ( openBracket.test(line)  && line.indexOf('=') === -1 ) {
        return true;
    }
    // }
    else if ( closeBracket.test(line) && !areWeInAHash ) {
        return true;
    }
    // no brackets
    else {
        return false;
    }
}