'use strict';

// check for z-index values that aren't normalized
module.exports = function normalizeZIndex( line ) {
	if ( typeof line !== 'string' ) { return; }

	var arr;

	// the most basic of checks, throw warning if zindex value not normalized
	if ( line.indexOf( 'z-index' ) !== -1 ) {
		arr = line.split(/[\s\t,:]/);
		// remove white space
		arr = arr.filter(
			function( str ) {
				return str.length > 0;
			}
		);

		if ( arr[ arr.length - 1 ] % this.config.zIndexNormalize !== 0 ) {
			return true;
		}
		else {
			return false;
		}
	}
};
