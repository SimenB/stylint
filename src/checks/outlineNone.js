'use strict';

var outlineRe = /(outline):*(?!-)/;

// checks for outline none
module.exports = function checkOutlineNone( line ) {
	if ( typeof line !== 'string' ) { return; }

	var hasOutlineNone = false;

	// return true if outline none found
	if ( outlineRe.test( line ) ) {
		if ( line.indexOf('none') !== -1 ) {
			hasOutlineNone = true;
		}
	}

	return hasOutlineNone;
};
