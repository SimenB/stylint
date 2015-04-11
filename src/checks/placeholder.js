'use strict';

// check that @extend is only used with a $placeholderVar
module.exports = function checkPlaceholderStyle( app ) {
	if ( app.cache.line.indexOf('@extend') === -1 ) {
		return;
	}

	var placeholderCorrect = false;

	// first check if line has an extend
	if ( app.cache.line.indexOf('@extend $') !== -1 ||
		app.cache.line.indexOf('@extends $') !== -1 ) {
		placeholderCorrect = true;
	}

	return placeholderCorrect;
};
