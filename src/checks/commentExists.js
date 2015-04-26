'use strict';

// check for line comment anywhere on the line
module.exports = function commentExists(line) {
	this.state.hasComment = false;

	if ( line.indexOf('//') !== -1 ) {
		this.state.hasComment = true;
	}

	return this.state.hasComment;
};
