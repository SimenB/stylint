'use strict';

// checks if * is a valid use case or not
var universalRe = /( |\w|\d|'|"|\*|\/)(\*)( |\w|\d|'|"|\*|\$|\=)/;    //  /(?!^)(\S| |\t)(\*)(\s|\w|\d|\$|\=)/;

/**
* check for * selector.
* technically this is used as part of resets often, for good reason, despite its slowness
* which is why i'm setting it up as a warning as it won't break code but maybe you prefer to not use it
*/
module.exports = function universal(line) {
	var hasUniversal = false;

	// content can have a string that could be anything, so ignore those
	if ( line.indexOf('*') !== -1 && line.indexOf('content') === -1 ) {
		if ( !universalRe.test( line ) ) {
			hasUniversal = true;
		}
	}

	if ( hasUniversal ) {
		this.msg('* selector is disallowed');
	}

	return hasUniversal;
};
