'use strict';

// check for specified extend preference
module.exports = function checkExtendStyle( app ) {
	if ( app.cache.line.indexOf('@extend') === -1 ) { return; }
	var extendsCorrect = true;

	// prefer @extends to @extend
	// extremely petty, i know
	if ( app.config.extendsPref === '@extends' ) {
		if ( app.cache.line.indexOf('@extends ') === -1 ) {
			extendsCorrect = false;
		}
	}
	// else @extend is your pref
	else {
		if ( app.cache.line.indexOf('@extend ') === -1 ) {
			extendsCorrect = false;
		}
	}

	return extendsCorrect;
};
