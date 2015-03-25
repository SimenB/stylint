'use strict';

// if we disallowed css literals, check for them and return true if found
module.exports = function checkCssLiteral( line ) {
	if ( typeof line !== 'string' ) { return; }

	if ( line.indexOf('@css') !== -1 ) {
		return true;
	}
	else {
		return false;
	}
};
