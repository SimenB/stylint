'use strict';

// check for semicolons
module.exports = function checkForSemicolons( app ) {
	var hasSemicolon = false;

	if ( app.cache.line.indexOf(';') !== -1 ) {
		hasSemicolon = true;
	}

	return hasSemicolon;
};
