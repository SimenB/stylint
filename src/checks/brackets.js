'use strict';

module.exports = function checkForBadBrackets( app ) {
	if ( app.state.cssBlock || app.state.hash ) { return; }

	var badBracket = false;

	// just strips out interpolated variables, simplifies the check
	var line = app.cache.line.replace(/{\S+}/, '');

	// ex: $hash = { is ok but .class = { is not
	if ( line.indexOf('{') !== -1 && line.indexOf('=') === -1 ) {
		badBracket = true;
	}

	// ex: } is okay if ending a hash. otherwise it is not okay
	if ( line.indexOf('}') !== -1 && !app.state.hash ) {
		badBracket = true;
	}

	if ( badBracket === true ) {
		app.cache.warnings.push( 'unecessary bracket' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
	}

	return badBracket;
};
