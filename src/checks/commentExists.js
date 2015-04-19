'use strict';

// check for line comment anywhere on the line
module.exports = function checkForComment() {
	var hasComment = false;

	if ( this.cache.line.indexOf('//') !== -1 ) { //hasCommentRe.test(line) ) {
		hasComment = true;
	}

	return hasComment;
};
