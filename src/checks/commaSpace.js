'use strict';

var spaceAfterRe = /,[a-zA-Z]/;
var spaceAfterNumRe = /,(?:\d*\.)?\d+/;

// check that commas are followed by spaces
module.exports = function checkCommaStyle() {
	var badComma = true;

	// if , is present on line
	if ( this.cache.line.indexOf(',') !== -1 &&
		this.cache.line.indexOf(',') !== this.cache.line.length - 1 ) {
		// if no space after or space below
		if ( spaceAfterRe.test(this.cache.line) ||
			spaceAfterNumRe.test(this.cache.line) ) {
			badComma = false; //return false;
		}
	}

	if ( badComma === true ) {
		this.cache.warnings.push( 'commas must be followed by a space for readability' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return badComma;
};
