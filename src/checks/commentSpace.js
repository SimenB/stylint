'use strict';

// check for space after comment line
var commentRe = /\/\/ /;

module.exports = function commentSpace(line) {
	if ( !this.state.hasComment ) { return; }
	// if ( line.indexOf('http://') !== -1 ) { return; }

	var spaceAfterComment = false;

	// check for space after comment on it's own line, if no space, return warning
	if ( commentRe.test(this.cache.comment) ) {
		spaceAfterComment = true;
	}

	if ( this.state.conf === 'always' && !spaceAfterComment ) {
		this.msg('line comments require a space after //');
	}
	else if ( this.state.conf === 'never' && spaceAfterComment ) {
		this.msg('spaces after line comments disallowed');
	}

	return spaceAfterComment;
};
