'use strict';

var leadingZeroRe = /0\.(?!\.)/;

// check for leading 0
module.exports = function leadingZero(line) {
	if ( line.indexOf('.') === -1 ) { return; }
	var leadingZero = false;
	var arr = this.stripWhiteSpace( new RegExp(/[\s\t]/), line );

	// return true if leading zero found and not used as part of range
	leadingZero = arr.some(function(val) {
		return leadingZeroRe.test(val);
	});

	if ( this.config.leadingZero === 'always' && !leadingZero ) {
		this.cache.warnings.push( 'leading zeros for decimal points are required' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	if ( this.config.leadingZero === 'never' && leadingZero ) {
		this.cache.warnings.push( 'leading zeros for decimal points are unecessary' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return leadingZero;
};
