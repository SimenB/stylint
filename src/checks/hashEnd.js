'use strict';

var hashEndRe = /^\}/;

// check if we're ending a hash
module.exports = function hashEnd(line) {
	if ( !this.state.hash ) { return; }

	// ex }, but only if we've already establish that we're in a hash'
	if (this.state.hash && hashEndRe.test(line) ) {
		this.state.hash = false;
	}

	return this.state.hash;
};
