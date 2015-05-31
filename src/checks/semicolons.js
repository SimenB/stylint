'use strict';

// check for semicolons
module.exports = function semicolons(line) {
	var semicolon = false;

	if ( line.indexOf(';') !== -1 ) {
		semicolon = true;
	}

	if ( semicolon ) {
		this.msg('unecessary semicolon found');
	}

	return semicolon;
};
