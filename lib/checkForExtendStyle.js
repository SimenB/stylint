// check for specified extend preference
module.exports = function checkExtendStyle(line, pref) {
    if (pref === 'extends') {
        if (line.indexOf('@extend ') !== -1) {
            return false;
        }
    }
    else {
        if (line.indexOf('@extends ') !== -1) {
            return false;
        }
    }
}