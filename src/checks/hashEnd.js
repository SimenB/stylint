'use strict';

var hashEndRe = /^\}/;

// check if we're ending a hash
module.exports = function hashEnd(line) {
	var hashEnded = false;

	// ex }, but only if we've already establish that we're in a hash'
	if (this.state.hash && hashEndRe.test(line) ) {
		hashEnded = true;
		this.state.hash = false;
	}

	return hashEnded;
};
