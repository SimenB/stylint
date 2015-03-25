'use strict';

var
	whitespace = /[ \t]+$/,  // check for unecessary tabs or whitespace at eol
	anythingElse = /[^ \t]/; // anything BUT whitespace (we dont want to return false positives on empty lines)

/**
 * check for trailing whitespace
 * @param  {string} line  the line being tested
 * @return {boolean} true if whitespace found, false if not
 */
module.exports = function checkWhitespace( line ) {
	if ( typeof line !== 'string' ) { return; }

	// not an empty line, with whitespace at the end
	if ( anythingElse.test(line) && whitespace.test(line) ) {
		return true;
	}
	else {
		return false;
	}
};
