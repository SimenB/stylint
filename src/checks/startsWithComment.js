'use strict';

var startsWithCommentRe = /(^\/\/)/;

// check for line comment on the line
module.exports = function startsWithComment(line) {
	var startsWithComment = false;

	// ex }, but only if we've already establish that we're not in a hash
	if ( line.indexOf('//') !== -1 && startsWithCommentRe.test( line.trim() ) ) {
		startsWithComment = true;
	}

	return startsWithComment;
};
