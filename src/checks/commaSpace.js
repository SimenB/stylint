'use strict';

var noSpaceRe = /,\S/gm;

// check that commas are followed by spaces
module.exports = function checkCommaStyle() {
	var badComma = false;

	// if , is present on line
	if ( this.cache.line.indexOf(',') !== -1 ) {
		// if no space after comma (newlines are okay)
		if ( noSpaceRe.test(line) ) {
			badComma = true;
		}
	}

	if ( badComma === true ) {
		this.cache.warnings.push( 'commas must be followed by a space for readability' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return badComma;
};
