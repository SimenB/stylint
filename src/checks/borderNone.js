'use strict';

// checks for border none
module.exports = function checkBorderNone( line ) {
	if ( typeof line !== 'string' ) { return; }

	// return true if border none found
	if ( line.indexOf('border') !== -1 ) {
		if ( line.indexOf('none') !== -1 ) {
			return true;
		}
		// if border 0 on line, then we good
		else {
			return false;
		}
	}
};
