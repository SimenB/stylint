'use strict';

// check for colons
module.exports = function colons(line) {
	var badColon = false;

	// : is allowed in hashes
	if ( !this.state.hash && line.indexOf(': ') !== -1 ) {
		badColon = true;
	}

	if ( badColon === true ) {
		this.cache.warnings.push( 'unecessary colon found:' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return badColon;
};
