'use strict';

// check for z-index values that are duplicated elsewhere
module.exports = function deDupeZIndex( line ) {
	if ( typeof line !== 'string' ) { return; }

	var arr,
		indentCount = 0,
		context = 0,
		isItADupe = false;

	// the most basic of checks, throw warning if zindex duplicated elsewhere
	if ( line.indexOf('z-index') !== -1 ) {
		arr = line.split(/[\s\t,:]/);

		// this is a basic nesting check
		arr.forEach(function( val, i ) {
			if ( arr[i].length === 0 ) {
				indentCount++; // spaces or tabs
			}
			else {
				context = indentCount / this.config.indentSpaces;
			}
		}.bind( this ));

		this.cache.zCache.forEach(function( val, i ) {
			if ( this.cache.zCache[i][0] === arr[ arr.length - 1 ] && context === this.cache.zCache[i][1] ) {
				isItADupe = true;
			}
		}.bind( this ));

		this.cache.zCache.push( [ arr[ arr.length - 1 ], context ] );
	}

	return isItADupe;
};
