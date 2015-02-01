'use strict';

var
	hasComment = /(\/\/)/,
	startWithLineComment = /(^\/\/)/;

// check for line comment on the line
module.exports = function checkForStart( line ) {
	if ( typeof line !== 'string' ) { return; }

	if ( hasComment.test(line) ) {
		// ex }, but only if we've already establish that we're not in a hash
		if ( startWithLineComment.test(line.trim()) ) {
			return true;
		}
		else {
			return false;
		}
	}
}