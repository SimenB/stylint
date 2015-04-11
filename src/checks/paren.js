'use strict';

// checks for extra space when declaring mixins before variables
module.exports = function checkMixinStyle( app ) {
	var hasExtraSpace = true;

	// if mixin exists and it has params
	if ( app.cache.line.indexOf('(') !== -1 &&
		app.cache.line.indexOf('()') === -1 ) {

		if ( app.cache.line.indexOf('( ') === -1 ||
			app.cache.line.indexOf(' )') === -1) {
			hasExtraSpace = false;
		}
	}

	return hasExtraSpace;
};
