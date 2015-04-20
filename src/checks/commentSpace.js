'use strict';

// check for space after comment line
var commentRe = /\/\/\s/;

module.exports = function commentSpace(line) {
	var badComment = true;

	// check for space after comment on it's own line, if no space, return warning
	if ( line.indexOf('//') === 0
		&& !commentRe.test(line) ) {
		badComment = false;
	}
	// check for space after comment if on same line, if no space, return warning
	else if ( line.indexOf('http://') === -1
		&& !commentRe.test(line) ) {
		badComment = false;
	}

	if ( badComment === false ) {
		this.cache.warnings.push( 'line comments require a space after //' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return badComment;
};
