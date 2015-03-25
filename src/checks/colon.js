'use strict';

// check for colons
module.exports = function checkForColon( line, areWeInAHash ) {
	if ( typeof areWeInAHash === 'undefined' || typeof line === 'undefined' ) { return; }

	// : is allowed in hashes
	if ( areWeInAHash === false && line.indexOf(': ') !== -1 ) {
		return true;
	}
	else {
		return false;
	}
};
