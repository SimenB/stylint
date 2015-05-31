'use strict';

// check for colons
module.exports = function colons(line) {
	var colon = false;

	// : is allowed in hashes
	if ( !this.state.hash && line.indexOf(':') !== -1 ) {
		colon = true;
	}

	if ( colon ) {
		this.msg('unecessary colon found');
	}

	return colon;
};
