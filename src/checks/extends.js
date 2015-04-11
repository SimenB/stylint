'use strict';

// check for specified extend preference
module.exports = function checkExtendStyle( line, pref ) {
	if ( typeof line !== 'string' ||
		typeof pref !== 'string' ||
		line.indexOf('@extend') === -1 ) {
		return;
	}

	var extendsCorrect = true;

	// prefer @extends to @extend
	// extremely petty, i know
	if ( pref === '@extends' ) {
		if ( line.indexOf('@extends ') === -1 ) {
			extendsCorrect = false;
		}
	}
	// else @extend is your pref
	else {
		if ( line.indexOf('@extend ') === -1 ) {
			extendsCorrect = false;
		}
	}

	return extendsCorrect;
};
