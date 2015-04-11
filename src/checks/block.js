'use strict';

var eqRe = /( =)|( \=\n)/;
var eqEndRe = /=$|=\s$/;
var hashRe = /\{$/;

// checks for use of @block when declaring blocks
module.exports = function checkBlockStyle( app ) {
	// if = is present on line and not a block var or hash
	if ( eqRe.test( app.cache.line ) ) {
		if ( app.cache.line.indexOf( '@block' ) === -1 &&
			!hashRe.test( app.cache.line ) &&
			eqEndRe.test( app.cache.line ) ) {

			// if = at end of line, but no value or @block
			return false;
		}
		else if ( app.cache.line.indexOf( '@block' ) !== -1 &&
			!hashRe.test( app.cache.line ) &&
			!eqEndRe.test( app.cache.line ) ) {
			// if = is present, @block is present, not a hash, and no = at the end
			return true;
		}
	}
};
