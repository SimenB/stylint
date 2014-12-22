/**
 * check nesting depth
 * @param  {string} line  the line being tested
 * @param  {number} limit the total number of indents allowed, not counting &: selectors
 * @param  {number} indentSpaces  default is 4. if no indents found will check depth using spaces
 * @return {boolean} true if nesting is too deep, false if not
 */
module.exports = function checkNesting( line, limit, indentSpaces ) {
    var tabs  = /^(\t)*/, // returns all tabs
        amp   = /^(\&\:)/,  // check if using & selector before we count tabs
        space = /^( {4})*/,
        arr = line.split(' ');
        arr = arr.filter(function( str ) { 
            return str.length === 0; 
        }),
        count = 0, index = 0;

    // pref is defined (it is by default), then assume we indent with tabs
    if ( indentSpaces ) {
        if ( arr.length / indentSpaces > limit ) {
            return true;
        }
        else {
            return false;
        }
    }
    // if not we check hard tabs
    else {
        // get all tabs, starting at beginning of string
        while ( line.charAt(index++) === '\t' ) {
            count++;
        }

        // trim string and check if line starts with &:, if true then subtract one from count
        if ( amp.test( line.trim() ) ) {
            count = count - 1;
        }

        if ( count > limit ) {
            return true;
        }
        else if ( count === 0 ) {
            return false;
        }
    }
}