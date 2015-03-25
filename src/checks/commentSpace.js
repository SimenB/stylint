'use strict';

// check for space after comment line
var comment = /\/\/\s/;

module.exports = function checkCommentStyle( line ) {
	if ( typeof line !== 'string' ) { return; }

	if ( line.indexOf('//') !== -1 ) {
		// check for space after comment on it's own line, if no space, return warning
		if ( line.indexOf('//') === 0 && !comment.test(line) ) {
			return false;
		}
		// check for space after comment if on same line, if no space, return warning
		else if ( line.indexOf('http://') === -1 && !comment.test(line) ) {
			return false;
		}
		else {
			return true;
		}
	}
};
