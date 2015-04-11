'use strict';

var eqEnd = /=$|=\s$/;
var hash = /\{$/;
var varCheck = /\$\w+/;

// check that $ is used when declaring vars
module.exports = function checkVarStyle( line ) {
	if ( typeof line !== 'string' ||
		line.indexOf(' = ') === -1 ) {
		return;
	}

	var isValidVar = false;

	// make sure it's not a block or hash
	if ( line.indexOf('@block') === -1 &&
		!hash.test(line) &&
		!eqEnd.test(line) ) {

		// at this point assume this line is defining a var and we check that the line starts with a $
		// and that it doesn't end with = (meaning its a block)
		if ( varCheck.test( line ) ) {
			return true;
		}
	}

	return isValidVar;
};
