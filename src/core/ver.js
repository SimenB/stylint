'use strict';

var fs = require('fs');

// called when --version or -v flags used, just displays version number
module.exports = function ver() {
	return console.log( '\nStylint version: 1.0.0\n' );
};
