'use strict';

var universalRe = /(\s|\w|\d)(\*)(\s|\w|\d|\$|\=)/;

/**
* check for * selector.
* technically this is used as part of resets often, for good reason, despite its slowness
* which is why i'm setting it up as a warning as it won't break code but maybe you prefer to not use it
*/
module.exports = function checkForUniversal( line ) {
	if ( typeof line !== 'string' ) { return; }

	if ( line.indexOf('*') !== -1 && line.indexOf('content') === -1 ) {
		// if * is a valid use (ie, not by itself), return true
		if ( universalRe.test( line ) ) {
			return false;
		}
		else {
			return true;
		}
	}
	else {
		return false;
	}
};
