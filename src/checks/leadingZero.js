'use strict';

var leadingZeroRe = /( |,)(0\.)+|(^0\.)+/;

// check for leading 0
module.exports = function hasLeadingZero( app ) {
	if ( app.cache.line.indexOf('0') === -1 ) {
		return;
	}

	var zeroFound = false;
	var arr = app.stripWhiteSpace( new RegExp(/[\s\t]/), app.cache.line );

	// return true if leading zero found and not used as part of range
	if ( app.cache.line.indexOf('0.') !== -1 &&
		app.cache.line.indexOf('0..') === -1) {

		arr.forEach(function( val ) {
			if ( leadingZeroRe.test( val ) ) {
				zeroFound = true;
			}
		});
		// for ( i; i < len; i++ ) {
		// 	if ( leadingZero.test( arr[i] ) ) {
		// 		zeroFound = true;
		// 	}
		// }
	}

	return zeroFound;
};
