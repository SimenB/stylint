'use strict';

// if we disallowed css literals, check for them and return true if found
module.exports = function cssLiteral(line) {
	if ( this.state.hashOrCSS ) { return; }
	var isCSSLiteral = false;

	if ( line.indexOf('@css') !== -1 ) {
		isCSSLiteral = true;
	}

	if ( isCSSLiteral ) {
		this.msg('css literals are disallowed');
	}

	return isCSSLiteral;
};
