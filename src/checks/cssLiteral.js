'use strict';

// if we disallowed css literals, check for them and return true if found
module.exports = function cssLiteral(line) {
	if ( this.state.hashOrCSS ) { return; }
	var isCSSLiteral = false;

	if ( line.indexOf('@css') !== -1 ) {
		isCSSLiteral = true;
	}

	if ( isCSSLiteral === true ) {
		this.cache.warnings.push( 'refrain from using css literals' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return isCSSLiteral;
};
