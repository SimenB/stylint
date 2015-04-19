'use strict';

// check for colons
module.exports = function checkForColon() {
	var badColon = false;

	// : is allowed in hashes
	if ( this.state.hash && this.cache.line.indexOf(': ') !== -1 ) {
		badColon = true;
	}

	if ( badColon === true ) {
		this.cache.warnings.push( 'unecessary colon found:' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return badColon;
};
