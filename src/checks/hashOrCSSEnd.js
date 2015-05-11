'use strict';

var hashEndRe = /^\}/;

// check if we're ending a hash
module.exports = function hashEnd(line) {
	if ( !this.state.hashOrCSS ) { return; }

	// ex }, but only if we've already establish that we're in a hash'
	if ( hashEndRe.test(line) ) {
		this.state.hashOrCSS = false;
		this.state.testsEnabled = true;
	}

	return this.state.hashOrCSS;
};
