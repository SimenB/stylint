'use strict';

var universalRe = /(\s|\w|\d)(\*)(\s|\w|\d|\$|\=)/;

/**
* check for * selector.
* technically this is used as part of resets often, for good reason, despite its slowness
* which is why i'm setting it up as a warning as it won't break code but maybe you prefer to not use it
*/
module.exports = function checkForUniversal( app ) {
	var hasUniversal = true;

	if ( app.cache.line.indexOf('*') !== -1 &&
		app.cache.line.indexOf('content') === -1 ) {
		// if * is a valid use (ie, not by itself), return true
		if ( universalRe.test( app.cache.line ) ) {
			hasUniversal = false; // return false;
		}
	}
	// @TODO do i need this?
	else {
		hasUniversal = false;
	}

	if ( hasUniversal === true ) {
		app.cache.warnings.push( '* selector is slow. Consider a different selector.' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
	}

	return hasUniversal;
};
