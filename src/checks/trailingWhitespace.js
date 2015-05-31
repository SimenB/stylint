'use strict';

var whitespaceRe = /[ \t]+$/; // check for unecessary tabs or whitespace at eol
var anythingElseRe = /[^ \t]/; // anything BUT whitespace (we dont want to return false positives on empty lines)

/**
 * check for trailing whitespace
 * @param  {string} line  the line being tested
 * @return {boolean} true if whitespace found, false if not
 */
module.exports = function trailingWhitespace(line) {
	var whitespace = false;

	// not an empty line, with whitespace at the end
	if ( anythingElseRe.test(line) &&
		whitespaceRe.test(line) ) {
		whitespace = true;
	}

	if ( whitespace ) {
		this.msg('trailing whitespace');
	}

	return whitespace;
};
