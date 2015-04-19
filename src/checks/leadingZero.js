'use strict';

var leadingZeroRe = /( |,)(0\.)+|(^0\.)+/;

// check for leading 0
module.exports = function hasLeadingZero() {
	// if no 0 at all on line, no work to do
	if ( this.cache.line.indexOf('0') === -1 ) {
		return;
	}

	var zeroFound = false;
	var arr = this.stripWhiteSpace( new RegExp(/[\s\t]/), this.cache.line );

	// return true if leading zero found and not used as part of range
	if ( this.cache.line.indexOf('0.') !== -1 &&
		this.cache.line.indexOf('0..') === -1) {

		arr.forEach(function( val ) {
			if ( leadingZeroRe.test( val ) ) {
				zeroFound = true;
			}
		});
	}

	if ( zeroFound === true ) {
		this.cache.warnings.push( 'leading zeros for decimal points are unecessary' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return zeroFound;
};
