'use strict';

var noSpaceRe = /,\S/gm;

// check that commas are followed by spaces
module.exports = function checkCommaStyle() {
	var badComma = false;

	// if , is present on line and its a BAD ONE
	if ( noSpaceRe.test(this.cache.line) ) {
		badComma = true;
	}

	if ( badComma === true ) {
		this.cache.warnings.push( 'commas must be followed by a space for readability' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return badComma;
};
