'use strict';

// check for semicolons
module.exports = function checkForSemicolons() {
	var hasSemicolon = false;

	if ( this.cache.line.indexOf(';') !== -1 ) {
		hasSemicolon = true;
	}

	if ( hasSemicolon === true ) {
		this.cache.warnings.push( 'unecessary semicolon found:' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return hasSemicolon;
};
