'use strict';

var hexRe = /#(?:[0-9a-f]{3}){1,2}$/i;

// if we disallowed hex colors, check for them and return true if found
module.exports = function checkHexColors( app ) {
	var badHex = false;

	// so basically if we're using #hex colors outside of a var declaration
	if ( hexRe.test( app.cache.line ) && app.cache.line.indexOf('=') === -1 ) {
		badHex = true;
	}

	return badHex;
};
