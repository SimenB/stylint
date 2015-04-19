'use strict';

// if we disallowed css literals, check for them and return true if found
module.exports = function checkCssLiteral() {
	var cssLiteral = false;

	if ( this.cache.line.indexOf('@css') !== -1 ) {
		cssLiteral = true;
	}

	if ( cssLiteral === true ) {
		this.cache.warnings.push( 'refrain from using css literals' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
		this.state.cssLiteral = true;
	}

	return cssLiteral;
};
