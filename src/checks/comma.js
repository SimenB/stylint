'use strict';

var spaceAfterRe = /,[a-zA-Z]/;
var spaceAfterNumRe = /,(?:\d*\.)?\d+/;

// check that commas are followed by spaces
module.exports = function checkCommaStyle( app ) {
	var badComma = true;

	// if , is present on line
	if ( app.cache.line.indexOf(',') !== -1 &&
		app.cache.line.indexOf(',') !== app.cache.line.length - 1 ) {
		// if no space after or space below
		if ( spaceAfterRe.test(app.cache.line) ||
			spaceAfterNumRe.test(app.cache.line) ) {
			badComma = false; //return false;
		}
	}

	return badComma;
};
