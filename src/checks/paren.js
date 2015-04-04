'use strict';

// checks for extra space when declaring mixins before variables
module.exports = function checkMixinStyle( line ) {
	if ( typeof line !== 'string' ) { return; }

	var hasExtraSpace;

	// if mixin exists and it has params
	if ( line.indexOf('(') !== -1 && line.indexOf('()') === -1 ) {
		if ( line.indexOf('( ') === -1 || line.indexOf(' )') === -1) {
			hasExtraSpace = false;
		}
		else {
			hasExtraSpace = true;
		}
	}

	return hasExtraSpace;
};
