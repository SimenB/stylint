'use strict';

// check for space after comment line
var commentRe = /\/\/\s/;

module.exports = function commentSpace(line) {
	if ( !this.state.hasComment ) { return; }
	var badComment = true;

	// check for space after comment on it's own line, if no space, return warning
	if ( !commentRe.test(this.cache.comment) && this.cache.comment.indexOf('http://') === -1 ) {
		badComment = false;
	}

	if ( badComment === false ) {
		this.cache.warnings.push( 'line comments require a space after //' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return badComment;
};
