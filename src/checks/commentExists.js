'use strict';

// check for line comment anywhere on the line
module.exports = function checkForComment( app ) {
	var hasComment = false;

	if ( app.cache.line.indexOf('//') !== -1 ) { //hasCommentRe.test(line) ) {
		hasComment = true;
	}

	return hasComment;
};
