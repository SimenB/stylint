'use strict';

// check for line comment anywhere on the line
module.exports = function checkForComment() {
	this.state.hasComment = false;

	if ( this.cache.line.indexOf('//') !== -1 ) {
		this.state.hasComment = true;
	}

	return this.state.hasComment;
};
