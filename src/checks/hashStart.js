'use strict';

// check if we're starting a hash
var hashStartRe = /{$|{ $/;
var stripMixinsRe = /(\(.*\))/;

module.exports = function checkForHashStart() {
	var hashStart = false;
	var strippedLine = this.cache.line.replace(stripMixinsRe, '');

	// ex colorsHash = {
	if ( hashStartRe.test(strippedLine) &&
		strippedLine.indexOf('=') !== -1 ) {
		hashStart = true;
	}

	return hashStart;
};
