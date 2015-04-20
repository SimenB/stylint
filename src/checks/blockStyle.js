'use strict';

var eqRe = /( =)|( \=\n)/;
var eqEndRe = /=$|=\s$/;
var hashRe = /\{$/;

// checks for use of @block when declaring blocks
module.exports = function blockStyle(line) {
	if ( !eqRe.test( line ) ) { return; }
	var blockStyleCorrect = true;

	// if = is present on line and not a block var or hash
	if ( line.indexOf('@block') === -1 ) {
		blockStyleCorrect = false;
	}

	if ( blockStyleCorrect === false ) {
		this.cache.warnings.push( 'block variables must include @block' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return blockStyleCorrect;
};
