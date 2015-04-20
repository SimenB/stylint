'use strict';

// check for semicolons
module.exports = function semicolons(line) {
	var hasSemicolon = false;

	if ( line.indexOf(';') !== -1 ) {
		hasSemicolon = true;
	}

	if ( hasSemicolon === true ) {
		this.cache.warnings.push( 'unecessary semicolon found:' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return hasSemicolon;
};
