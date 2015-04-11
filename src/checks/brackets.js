'use strict';

module.exports = function checkForBadBrackets( app ) {
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

	return badBracket;
};
