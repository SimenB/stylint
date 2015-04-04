'use strict';

// check that @extend is only used with a $placeholderVar
module.exports = function checkPlaceholderStyle( line ) {
	if ( typeof line !== 'string' ) { return; }

	var placeholderCorrect;

	if ( line.indexOf('@extend') !== -1 ) {
		// first check if line has an extend
		if ( line.indexOf('@extend ') !== -1 ) {
			if ( line.indexOf('@extend $') === -1 ) {
				placeholderCorrect = false;
			}
			else {
				placeholderCorrect = true;
			}
		}
		else if ( line.indexOf('@extends ') !== -1 ) {
			if ( line.indexOf('@extends $') === -1 ) {
				placeholderCorrect = false;
			}
			else {
				placeholderCorrect = true;
			}
		}
		// if line includes @extend or @extends without anything after it, error
		else {
			placeholderCorrect = false;
		}
	}

	return placeholderCorrect;
};
