'use strict';

// check for colons
module.exports = function checkForColon( app ) {
	var badColon = false;

	// : is allowed in hashes
	if ( app.state.hash && app.cache.line.indexOf(': ') !== -1 ) {
		badColon = true;
	}

	if ( badColon === true ) {
		app.cache.warnings.push( 'unecessary colon found:' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
	}

	return badColon;
};
