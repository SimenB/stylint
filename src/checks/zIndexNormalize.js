'use strict';

// check for z-index values that aren't normalized
module.exports = function normalizeZIndex( app ) {
	if ( app.cache.line.indexOf( 'z-index' ) === -1 ) {
		return;
	}

	var badZIndex = false;
	var arr = app.stripWhiteSpace( new RegExp(/[\s\t,:]/), app.cache.line );

	if ( arr[ arr.length - 1 ] % app.config.zIndexNormalize !== 0 ) {
		badZIndex = true; // return true;
	}

	return badZIndex;
};
