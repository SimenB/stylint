'use strict';

var leadingZeroRe = /0\.(?!\.)/;

// check for leading 0
module.exports = function leadingZero(line) {
	if ( line.indexOf('.') === -1 ) { return; }

	var leadingZero = false;
	var arr = this.splitAndStrip( new RegExp(/[\s\t]/), line );

	// return true if leading zero found and not used as part of range
	leadingZero = arr.some(function(val) {
		return leadingZeroRe.test(val);
	});

	if ( this.state.conf === 'always' && !leadingZero ) {
		this.msg('leading zeros for decimal points are required');
	}
	else if ( this.state.conf === 'never' && leadingZero ) {
		this.msg('leading zeros for decimal points are unecessary');
	}

	return leadingZero;
};
