'use strict';

// if we disallowed css literals, check for them and return true if found
module.exports = function cssLiteral(line) {
	if ( this.state.cssLiteral ) { return; }

	if ( line.indexOf('@css') !== -1 ) {
		this.state.cssLiteral = true;
	}

	if ( this.state.cssLiteral === true ) {
		this.cache.warnings.push( 'refrain from using css literals' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return this.state.cssLiteral;
};
