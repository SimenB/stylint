'use strict';

// check that @extend is only used with a $placeholderVar
module.exports = function checkPlaceholderStyle( line ) {
	if ( typeof line !== 'string' ||
	 line.indexOf('@extend') === -1 ) {
		return;
	}

	var placeholderCorrect = false;

	// first check if line has an extend
	if ( line.indexOf('@extend $') !== -1 ||
		line.indexOf('@extends $') !== -1 ) {
		placeholderCorrect = true;
	}

	return placeholderCorrect;
};
