// check for 0px (0 is preferred)

module.exports = function checkForPx(line) {
    // return false if 0px is found
    if (line.indexOf(' 0px') !== -1) {
        return false;
    }
}