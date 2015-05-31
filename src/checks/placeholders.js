'use strict';

var placeholderRe = /(@extend|@extends)+( \$)+/;

// check that @extend is only used with a $placeholderVar
module.exports = function placeholders(line) {
	if ( line.indexOf('@extend') === -1 ) { return; }

	var placeholder = false;

	// first check if line has an extend, then check for placeholder
	if ( placeholderRe.test(line) ) {
		placeholder = true;
	}

	if ( this.state.conf === 'always' && !placeholder ) {
		this.msg('use a placeholder variable when extending');
	}
	else if ( this.state.conf === 'never' && placeholder ) {
		this.msg('placeholder variables are disallowed');
	}

	return placeholder;
};
