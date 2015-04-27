'use strict';

// check for z-index values that aren't normalized
module.exports = function zIndexNormalize(line) {
	var badZIndex = false;
	var arr = this.stripWhiteSpace( new RegExp(/[\s\t,:]/), line );

	if ( arr[ arr.length - 1 ] % this.config.zIndexNormalize !== 0 ) {
		badZIndex = true; // return true;
	}

	if ( badZIndex === true ) {
		this.cache.warnings.push( 'this z-index value is not normalized' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return badZIndex;
};
