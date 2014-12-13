/**
 * issue error if nesting is greater than 3 and not starting with ampersand
 * stuff like :hover for instance, shouldn't count towards selector depth @TODO finetune this
 * @todo  also stuff like @media shouldn't count either
 */

const tabs  = /^(\t)*/, // returns all tabs
      amp   = /^(\&)/;  // check if using & selector before we count tabs

module.exports = function checkNesting(line, limit, pref, indent) {
    // console.log(line.match(space)[0].length);
    if (pref === 'tabs') {
        if (line.match(tabs)[0].length > limit && !amp.test(line)) {
            return true;
        }
    }
    // else {
    //     if (line.match(space)[0].length % indent !== 0) {
    //         return true;
    //     }
    //     // if ( (line.match(space)[0].length > limit && !amp.test(line)) {
    //     //     return true;
    //     // }
    // }
}