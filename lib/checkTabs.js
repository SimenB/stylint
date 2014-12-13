/**
 * find tabs in line (potentially invalid)
 */

const tabs  = /^(\t)*/; // returns all tabs

// just checks if # of spaces is divisible by 4
module.exports = function checkTabs(line) {
    if (tabs.test(line)) {
        return true;
    }
}