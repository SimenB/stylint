'use strict';

// check for line comment on the line
var hasComment = /(\/\/)/;

module.exports = function checkForComment( line ) {
	if ( typeof line !== 'string' ) { return; }

	// ex }, but only if we've already establish that we're not in a hash
	if ( hasComment.test(line) ) {
		return true;
	}
	else {
		return false;
	}
};
