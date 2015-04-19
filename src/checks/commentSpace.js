'use strict';

// check for space after comment line
var commentRe = /\/\/\s/;

module.exports = function checkCommentStyle() {
	var badComment = true;

	if ( this.cache.line.indexOf('//') !== -1 ) {
		// check for space after comment on it's own line, if no space, return warning
		if ( this.cache.line.indexOf('//') === 0
			&& !commentRe.test(this.cache.line) ) {
			badComment = false;
		}
		// check for space after comment if on same line, if no space, return warning
		else if ( this.cache.line.indexOf('http://') === -1
			&& !commentRe.test(this.cache.line) ) {
			badComment = false;
		}
	}

	if ( badComment === false ) {
		this.cache.warnings.push( 'line comments require a space after //' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return badComment;
};
