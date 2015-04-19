'use strict';

var hexRe = /#(?:[0-9a-f]{3}){1,2}/igm;

// if we disallowed hex colors, check for them and return true if found
module.exports = function checkHexColors() {
	var badHex = false;

	// so basically if we're using #hex colors outside of a var declaration
	if ( hexRe.test( this.cache.line ) && this.cache.line.indexOf('=') === -1 ) {
		badHex = true;
	}

	if ( badHex === true ) {
		this.cache.warnings.push( 'hexidecimal color should be a variable:' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	// @TODO this is madness - if i comment this out the test fails
	console.log( this.cache.line )
	console.log( this.cache.line.indexOf('=') === -1 );
	console.log( hexRe.test( this.cache.line ) );

	return badHex;
};
