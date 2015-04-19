'use strict';

var borderRe = /(border):*(?!-)/;

// checks for border none
module.exports = function checkBorderNone( app ) {
	var badBorder = false;

	// return true if border none found
	if ( borderRe.test( app.cache.line ) && app.cache.line.indexOf('none') !== -1 ) {
		badBorder = true;
	}

	if ( badBorder === true ) {
		app.cache.warnings.push( 'border 0 is preferred over border none' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
	}

	return badBorder;
};
