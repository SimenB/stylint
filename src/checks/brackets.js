'use strict';

module.exports = function checkForBadBrackets( line, inHash ) {
	if ( typeof line !== 'string' ||
		typeof inHash === 'undefined' ) {
		return;
	}

	var badBracket = false;
	// just strips out interpolated variables
	line = line.replace(/{\S+}/, '');

	// ex: $hash = { is ok but .class = { is not
	if ( line.indexOf('{') !== -1 && line.indexOf('=') === -1 ) {
		badBracket = true;
	}

	// ex: } is okay if ending a hash. otherwise it is not okay
	if ( line.indexOf('}') !== -1 && !inHash ) {
		badBracket = true;
	}

	return badBracket;
};
