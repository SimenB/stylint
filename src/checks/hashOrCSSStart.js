'use strict';

// check if we're starting a hash
var hashStartRe = /{$|{ $/;
var stripMixinsRe = /(\(.*\))/;

module.exports = function hashStart(line) {
	if ( this.state.hashOrCSS ) { return; }
	var strippedLine = line.replace(stripMixinsRe, '');

	// ex colorsHash = { or @css {
	if ( ( !this.config.cssLiteral && line.indexOf('@css') !== -1 ) ||
		( hashStartRe.test(strippedLine) && strippedLine.indexOf('=') !== -1 ) ) {
		this.state.hashOrCSS = true;
		this.state.testsEnabled = false;
	}

	return this.state.hashOrCSS;
};
