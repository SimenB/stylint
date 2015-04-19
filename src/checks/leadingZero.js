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
	}

	if ( zeroFound === true ) {
		app.cache.warnings.push( 'leading zeros for decimal points are unecessary' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
	}

	return zeroFound;
};
