'use strict';

// check if we're starting a hash
var hashStartingRe = /{$|{ $/;
var stripMixinsRe = /(\(.*\))/;

module.exports = function checkForHashStart( line ) {
	if ( typeof line !== 'string' ) { return; }

	var newLine = line.replace(stripMixinsRe, '');

	// ex colorsHash = {
	if ( hashStartingRe.test(newLine) && newLine.indexOf('= ') !== -1 && newLine.indexOf('*=') === -1 ) {
		return true;
	}
	else {
		return false;
	}
};
