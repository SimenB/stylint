/**
 * issue error if nesting is greater than 3 and not starting with ampersand
 * stuff like :hover for instance, shouldn't count towards selector depth
 */

const space = /\s{2,}/,  // returns all whitespace that is more than 2 spaces
      amp   = /^(\&)/;   // check if using & selector before we count tabs

// just checks if # of spaces is divisible by 4
module.exports = function checkSpaces(line, limit, indent) {
    if (line.match(space)[0].length % indent !== 0) {
        return true;
    }
}