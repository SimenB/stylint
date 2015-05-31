'use strict';

var hexRe = /#(?:[0-9a-f]{3}){1,2}/im;

// if we disallowed hex colors, check for them and return true if found
module.exports = function colors(line) {
	if ( line.indexOf('=') !== -1 ) { return; }
	var hex = false;

	// so basically if we're using #hex colors outside of a var declaration
	if ( hexRe.test( line ) ) {
		hex = true;
	}

	if ( hex ) {
		this.msg('hexidecimal color should be a variable');
	}

	return hex;
};
