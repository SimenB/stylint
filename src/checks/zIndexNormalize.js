'use strict';

// check for z-index values that aren't normalized
module.exports = function zIndexNormalize(line) {
	var badZIndex = false;
	var arr = this.splitAndStrip( new RegExp(/[\s\t,:]/), line );

	// ignore 0 or 1 values
	if ( arr[ arr.length - 1 ] === '-1' || arr[ arr.length - 1 ] === '0' ) {
		return;
	}

	if ( line.indexOf('z-index') !== -1 && arr[ arr.length - 1 ] % this.state.conf ) {
		badZIndex = true;
	}

	if ( badZIndex ) {
		this.msg('this z-index value is not normalized');
	}

	return badZIndex;
};
