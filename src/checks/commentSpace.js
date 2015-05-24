'use strict';

// check for space after comment line
var commentRe = /\/\/ /;

module.exports = function commentSpace(line) {
	if ( !this.state.hasComment ) { return; }
	if ( line.indexOf('http://') !== -1 ) { return; }

	var spaceAfterComment = false;

	// check for space after comment on it's own line, if no space, return warning
	if ( commentRe.test(this.cache.comment) ) {
		spaceAfterComment = true;
	}

	if ( this.config.commentSpace === 'always' && !spaceAfterComment ) {
		this.cache.warnings.push( 'line comments require a space after //' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() + ' ' + this.cache.comment );
	}

	if ( this.config.commentSpace === 'never' && spaceAfterComment ) {
		this.cache.warnings.push( 'spaces after line comments disallowed' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() + ' ' + this.cache.comment );
	}

	return spaceAfterComment;
};
