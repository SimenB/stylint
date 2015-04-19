'use strict';

var outlineRe = /(outline):*(?!-)/;

// checks for outline none
module.exports = function checkOutlineNone() {
	if ( typeof line !== 'string' ) { return; }

	var hasOutlineNone = false;

	// return true if outline none found
	if ( outlineRe.test( line ) ) {
		if ( line.indexOf('none') !== -1 ) {
			hasOutlineNone = true;
		}
	}

	if ( hasOutlineNone === true ) {
		this.cache.warnings.push( 'prefer outline 0 over outline none:' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return hasOutlineNone;
};
