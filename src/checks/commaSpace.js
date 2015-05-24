'use strict';

// if , is present on line and its not followed by a space
var noSpaceRe = /,\S/;

// if set to always, enforces spaces after commas. if set to never, disallows spaces
module.exports = function commaSpace(line) {
	// conditions where testing isn't needed.
	// 1: no comma on line at all
	// 2: comma ends the line, as in a list
	if ( line.indexOf(',') === - 1 ||
		line.indexOf(',') === line.length - 1 ) {
		return;
	}

	var noSpaceAfterComma = false;

	if ( noSpaceRe.test(line) ) {
		noSpaceAfterComma = true;
	}

	// if spaces should be follow commas, but there is no space on the line
	if ( this.config.commaSpace === 'always' && noSpaceAfterComma ) {
		this.cache.warnings.push( 'commas must be followed by a space for readability' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	// if spaces should not be followed by a comma, but there are spaces anyway
	if ( this.config.commaSpace === 'never' && !noSpaceAfterComma ) {
		this.cache.warnings.push( 'spaces after commas are not allowed' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return noSpaceAfterComma;
};
