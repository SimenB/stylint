/**
 * find spaces in line greater than 2 in length (ie, potentially invalid whitespace)
 */

const space = /^\s/;  // check if line starts with whitespace

// just checks if # of spaces is divisible by 4
module.exports = function checkSpaces(line) {

    console.log( space.test(line) );

    if (space.test(line)) {
        return true;
    }
}