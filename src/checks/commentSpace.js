'use strict';

// check for space after comment line
var commentRe = /\/\/\s/;

module.exports = function checkCommentStyle( app ) {
	var badComment = true;

	if ( app.cache.line.indexOf('//') !== -1 ) {
		// check for space after comment on it's own line, if no space, return warning
		if ( app.cache.line.indexOf('//') === 0
			&& !commentRe.test(app.cache.line) ) {
			badComment = false;
		}
		// check for space after comment if on same line, if no space, return warning
		else if ( app.cache.line.indexOf('http://') === -1
			&& !commentRe.test(app.cache.line) ) {
			badComment = false;
		}
	}

	return badComment;
};
