'use strict';

var eqEndRe = /=$|=\s$/;
var hashRe = /\{$/;
var varCheckRe = /\$\w+/;

// check that $ is used when declaring vars
module.exports = function checkVarStyle( app ) {
	if ( app.cache.line.indexOf(' = ') === -1 ) {
		return;
	}

	var isValidVar = false;

	// make sure it's not a block or hash
	if ( app.cache.line.indexOf('@block') === -1 &&
		!hashRe.test(app.cache.line) &&
		!eqEndRe.test(app.cache.line) ) {

		// at this point assume this line is defining a var and we check that the line starts with a $
		// and that it doesn't end with = (meaning its a block)
		if ( varCheckRe.test(app.cache.line) ) {
			isValidVar = true;
		}
	}

	if ( isValidVar === false ) {
		app.cache.warnings.push( 'variables must be prefixed with the $ sign.' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
	}

	return isValidVar;
};
