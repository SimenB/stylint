'use strict';

var hex = /#(?:[0-9a-f]{3}){1,2}$/i;

// if we disallowed hex colors, check for them and return true if found
module.exports = function checkHexColors( line ) {
	if ( typeof line !== 'string' ) {
		return false;
	}

	if ( hex.test( line ) && line.indexOf('=') === -1 ) {
		return true;
	}
	else {
		return false;
	}
};
