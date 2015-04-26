'use strict';

// check if we're starting a hash
var hashStartRe = /{$|{ $/;
var stripMixinsRe = /(\(.*\))/;

module.exports = function hashStart(line) {
	var hashStart = false;
	var strippedLine = line.replace(stripMixinsRe, '');

	// ex colorsHash = {
	if ( hashStartRe.test(strippedLine) && strippedLine.indexOf('=') !== -1 ) {
		hashStart = true;
		this.state.hash = true;
	}

	return hashStart;
};
