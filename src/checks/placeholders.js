'use strict';

var extendsRe = /(@extend|@extends)+( \$)+/;

// check that @extend is only used with a $placeholderVar
module.exports = function placeholders(line) {
	var placeholderCorrect = true;

	// first check if line has an extend, then check for placeholder
	if ( line.indexOf('@extend') !== -1 && !extendsRe.test(line) ) {
		placeholderCorrect = false;
	}

	if ( placeholderCorrect === false ) {
		this.cache.warnings.push( 'please extend only placeholder vars' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return placeholderCorrect;
};
