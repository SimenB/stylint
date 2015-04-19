'use strict';

var eqEndRe = /=$|=\s$/;
var hashRe = /\{$/;
var varCheckRe = /\$\w+/;

// check that $ is used when declaring vars
module.exports = function checkVarStyle() {
	var isValidVar = false;

	// make sure it's not a block or hash
	if ( this.cache.line.indexOf('@block') === -1 &&
		!hashRe.test(this.cache.line) &&
		!eqEndRe.test(this.cache.line) ) {

		// at this point assume this line is defining a var and we check that the line starts with a $
		// and that it doesn't end with = (meaning its a block)
		if ( varCheckRe.test(this.cache.line) ) {
			isValidVar = true;
		}
	}

	if ( isValidVar === false ) {
		this.cache.warnings.push( 'variables must be prefixed with the $ sign.' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return isValidVar;
};
