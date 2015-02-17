'use strict';

// check for specified extend preference
module.exports = function checkPlaceholderStyle( line ) {
	if ( typeof line !== 'string' ) { return; }

	if ( line.indexOf('@extend') !== -1 ) {
		// first check if line has an extend
		if ( line.indexOf('@extend ') !== -1 ) {
			if ( line.indexOf('@extend $') === -1 ) {
				return false;
			}
			else {
				return true;
			}
		}
		else if ( line.indexOf('@extends ') !== -1 ) {
			if ( line.indexOf('@extends $') === -1 ) {
				return false;
			}
			else {
				return true;
			}
		}
	}
}
