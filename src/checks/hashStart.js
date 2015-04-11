'use strict';

// check if we're starting a hash
var hashStartRe = /{$|{ $/;

module.exports = function checkForHashStart( app ) {
	var hashStart = false;

	// ex colorsHash = {
	if ( hashStartRe.test(app.cache.line) &&
		app.cache.line.indexOf('=') !== -1 ) {
		hashStart = true;
	}

	return hashStart;
};
