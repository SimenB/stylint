'use strict';

var noSpaceRe = /,\S/gm;

// check that commas are followed by spaces
module.exports = function checkCommaStyle(line) {
	var badComma = false;

	// if , is present on line and its a BAD ONE
	if ( noSpaceRe.test(line) ) {
		badComma = true;
	}

	if ( badComma === true ) {
		this.cache.warnings.push( 'commas must be followed by a space for readability' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return badComma;
};
