'use strict';

var borderRe = /(border):*(?!-)/;

// checks for border none
module.exports = function checkBorderNone() {
	var badBorder = false;

	console.log( this );
	return;

	// return true if border none found
	if ( borderRe.test( this.cache.line ) && this.cache.line.indexOf('none') !== -1 ) {
		badBorder = true;
	}

	if ( badBorder === true ) {
		this.cache.warnings.push( 'border 0 is preferred over border none' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return badBorder;
};
