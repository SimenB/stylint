'use strict';

var
	eqRe = /( =)|( \=\n)/,
	eqEndRe = /=$|=\s$/,
	hashRe = /\{$/;

// checks for use of @block when declaring blocks
module.exports = function checkBlockStyle( line ) {
	if ( typeof line !== 'string' ) { return; }

	// if = is present on line and not a block var or hash
	if ( eqRe.test( line ) ) {
		if ( line.indexOf( '@block' ) === -1 &&
			!hashRe.test( line ) &&
			eqEndRe.test( line ) ) {

			// if = at end of line, but no value or @block
			return false;
		}
		else if ( line.indexOf( '@block' ) !== -1 &&
			!hashRe.test( line ) &&
			!eqEndRe.test( line ) ) {
			// if = is present, @block is present, not a hash, and no = at the end
			return true;
		}
	}
};
