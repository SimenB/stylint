'use strict';

var hashEndingRe = /^\}/;

// check if we're ending a hash
module.exports = function checkForHashEnd( app ) {
	var hashEnded = false;

	// ex }, but only if we've already establish that we're in a hash'
	if ( hashEndingRe.test(app.cache.line) && app.state.hash ) {
		hashEnded = true;
	}

	return hashEnded;
};
