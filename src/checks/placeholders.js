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

	if ( this.config.placeholders === 'always' && !placeholder ) {
		this.cache.warnings.push( 'use a placeholder variable when extending' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	if ( this.config.placeholders === 'never' && placeholder ) {
		this.cache.warnings.push( 'placeholder variables are disallowed' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return placeholder;
};
