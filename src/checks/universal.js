'use strict';

var universalRe = /(\s|\w|\d)(\*)(\s|\w|\d|\$|\=)/;

/**
* check for * selector.
* technically this is used as part of resets often, for good reason, despite its slowness
* which is why i'm setting it up as a warning as it won't break code but maybe you prefer to not use it
*/
module.exports = function checkForUniversal() {
	var hasUniversal = true;

	if ( this.cache.line.indexOf('*') !== -1 &&
		this.cache.line.indexOf('content') === -1 ) {
		// if * is a valid use (ie, not by itself), return true
		if ( universalRe.test( this.cache.line ) ) {
			hasUniversal = false; // return false;
		}
	}
	// @TODO do i need this?
	else {
		hasUniversal = false;
	}

	if ( hasUniversal === true ) {
		this.cache.warnings.push( '* selector is slow. Consider a different selector.' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return hasUniversal;
};
