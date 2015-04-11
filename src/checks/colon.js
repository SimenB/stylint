'use strict';

// check for colons
module.exports = function checkForColon( app ) {
	var badColon = false;

	// : is allowed in hashes
	if ( app.state.hash && app.cache.line.indexOf(': ') !== -1 ) {
		badColon = true;
	}

	return badColon;
};
