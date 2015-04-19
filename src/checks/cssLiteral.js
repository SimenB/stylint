'use strict';

// if we disallowed css literals, check for them and return true if found
module.exports = function checkCssLiteral( app ) {
	var cssLiteral = false;

	if ( app.cache.line.indexOf('@css') !== -1 ) {
		return true;
	}

	if ( cssLiteral === true ) {
		app.cache.warnings.push( 'refrain from using css literals' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
		return;
	}

	return cssLiteral;
};
