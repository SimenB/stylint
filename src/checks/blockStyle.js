'use strict';

var eqRe = /( =)|( \=\n)/;
var eqEndRe = /=$|=\s$/;
var hashRe = /\{$/;

// checks for use of @block when declaring blocks
module.exports = function checkBlockStyle() {
	var blockStyleCorrect = true;

	// if = is present on line and not a block var or hash
	if ( eqRe.test( this.cache.line ) ) {
		if ( this.cache.line.indexOf( '@block' ) === -1 &&
			!hashRe.test( this.cache.line ) &&
			eqEndRe.test( this.cache.line ) ) {

			blockStyleCorrect = false;
		}
	}

	if ( blockStyleCorrect === false ) {
		this.cache.warnings.push( 'block variables must include @block' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return blockStyleCorrect;
};
