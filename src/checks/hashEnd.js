'use strict';

var hashEnding = /^\}/;

// check if we're ending a hash
module.exports = function checkForHashEnd( line, areWeInAHash ) {
	if ( typeof line !== 'string' || typeof areWeInAHash === 'undefined' ) { return; }

	// ex }, but only if we've already establish that we're in a hash'
	if ( hashEnding.test(line) && areWeInAHash ) {
		return true;
	}
	else {
		return false;
	}
};
