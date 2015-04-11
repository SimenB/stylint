'use strict';

// check for z-index values that are duplicated elsewhere
module.exports = function deDupeZIndex( app ) {
	if ( app.cache.line.indexOf('z-index') === -1 ) {
		return;
	}

	var arr = app.cache.line.split(/[\s\t,:]/);
	var context = app.getContext(app.config.indentSpaces, app.cache.line);
	var isItADupe = false;

	app.cache.zCache.forEach(function( val, i ) {
		if ( app.cache.zCache[i][0] === arr[ arr.length - 1 ] && context === app.cache.zCache[i][1] ) {
			isItADupe = true;
		}
	});

	app.cache.zCache.push( [ arr[ arr.length - 1 ], context ] );

	return isItADupe;
};
