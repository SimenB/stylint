'use strict';

// if we disallowed css literals, check for them and return true if found
module.exports = function checkCssLiteral(line) {
	var cssLiteral = false;

	if ( line.indexOf('@css') !== -1 ) {
		cssLiteral = true;
	}

	if ( cssLiteral === true ) {
		this.cache.warnings.push( 'refrain from using css literals' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
		this.state.cssLiteral = true;
	}

	return cssLiteral;
};
