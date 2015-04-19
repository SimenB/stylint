'use strict';

var hasCommentRe = /(\/\/)/;
var startsWithCommentRe = /(^\/\/)/;

// check for line comment on the line
module.exports = function checkForStart() {
	var startsWithComment = false;

	if ( hasCommentRe.test(this.cache.line) ) {
		// ex }, but only if we've already establish that we're not in a hash
		if ( startsWithCommentRe.test(this.cache.line.trim()) ) {
			startsWithComment = true;
		}
	}

	return startsWithComment;
};
