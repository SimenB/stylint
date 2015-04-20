'use strict';

var leadingZeroRe = /( |,)(0\.)+|(^0\.)+/;

// check for leading 0
module.exports = function hasLeadingZero(line) {
	var zeroFound = false;
	var arr = this.stripWhiteSpace( new RegExp(/[\s\t]/), line );

	// return true if leading zero found and not used as part of range
	if ( line.indexOf('0.') !== -1 && line.indexOf('0..') === -1) {
		arr.forEach(function( val ) {
			if ( leadingZeroRe.test( val ) ) {
				zeroFound = true;
			}
		});
	}

	if ( zeroFound === true ) {
		this.cache.warnings.push( 'leading zeros for decimal points are unecessary' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return zeroFound;
};
