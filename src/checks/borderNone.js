'use strict';

var borderRe = /(border):*(?!-)/;

// checks for border none
module.exports = function checkBorderNone( app ) {
	// return true if border none found
	if ( borderRe.test( app.cache.line ) ) {
		if ( app.cache.line.indexOf('none') !== -1 ) {
			return true;
		}
		// if border 0 on line, then we good
		else {
			return false;
		}
	}
};
