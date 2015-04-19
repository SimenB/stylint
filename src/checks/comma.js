'use strict';

var noSpaceRe = /,\S/gm;

// check that commas are followed by spaces
module.exports = function checkCommaStyle( line ) {
	if ( typeof line !== 'string' ) { return; }

	// if , is present on line
	if ( line.indexOf(',') !== -1 && line.indexOf(',') !== line.length - 1 ) {
		// if no space after comma (newlines are okay)
		if ( noSpaceRe.test(line) ) {
			return false;
		}
		else {
			return true;
		}
	}
};
