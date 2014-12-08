// check for colons
module.exports = function checkForColon(line) {
    if (line.indexOf(': ') !== -1) {
        return true;
    }
}