'use strict';

// check for semicolons
module.exports = function checkForSemicolons( app ) {
	var hasSemicolon = false;

	if ( app.cache.line.indexOf(';') !== -1 ) {
		hasSemicolon = true;
	}

	if ( hasSemicolon === true ) {
		app.cache.warnings.push( 'unecessary semicolon found:' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
	}

	return hasSemicolon;
};
