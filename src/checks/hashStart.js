'use strict';

// check if we're starting a hash
var hashStartRe = /{$|{ $/;
var stripMixinsRe = /(\(.*\))/;

module.exports = function hashStart(line) {
	if ( this.state.hash ) { return; }
	var strippedLine = line.replace(stripMixinsRe, '');

	// ex colorsHash = {
	if ( hashStartRe.test(strippedLine) && strippedLine.indexOf('=') !== -1 ) {
		this.state.hash = true;
	}

	return this.state.hash;
};
