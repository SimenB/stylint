'use strict';

var extendsRe = /(@extend|@extends)+[ $]+/;

// check that @extend is only used with a $placeholderVar
module.exports = function checkPlaceholderStyle( app ) {
	if ( app.cache.line.indexOf('@extend') === -1 ) {
		return;
	}

	var placeholderCorrect = true;

	// first check if line has an extend
	if ( !extendsRe.test(app.cache.line) ) {
		placeholderCorrect = false;
	}

	if ( placeholderCorrect === false ) {
		app.cache.warnings.push( 'please extend only placeholder vars' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
	}

	return placeholderCorrect;
};
