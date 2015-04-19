'use strict';

var extendsRe = /(@extend|@extends)+[ $]+/;

// check that @extend is only used with a $placeholderVar
module.exports = function checkPlaceholderStyle() {
	if ( this.cache.line.indexOf('@extend') === -1 ) {
		return;
	}

	var placeholderCorrect = true;

	// first check if line has an extend
	if ( !extendsRe.test(this.cache.line) ) {
		placeholderCorrect = false;
	}

	if ( placeholderCorrect === false ) {
		this.cache.warnings.push( 'please extend only placeholder vars' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return placeholderCorrect;
};
