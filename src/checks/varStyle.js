'use strict';

var eqEndRe = /=$|=\s$/;
var hashRe = /\{$/;
var varCheckRe = /\$\w+/;

// check that $ is used when declaring vars
module.exports = function varStyle(line) {
	var isValidVar = false;

	// make sure it's not a block or hash
	if ( line.indexOf('@block') === -1 &&
		!hashRe.test(line) &&
		!eqEndRe.test(line) ) {

		// at this point assume this line is defining a var and we check that the line starts with a $
		// and that it doesn't end with = (meaning its a block)
		if ( varCheckRe.test(line) ) {
			isValidVar = true;
		}
	}

	if ( isValidVar === false ) {
		this.cache.warnings.push( 'variables must be prefixed with the $ sign.' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return isValidVar;
};
