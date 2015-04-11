'use strict';

var fs = require('fs');

// called when --version or -v flags used, just displays version number
module.exports = function version( app, dir ) {
	if ( typeof dir !== 'string' ) { return; }
	return fs.readFile(dir + '/package.json',
		function( err, data ) {
			return console.log( '\nStylint version: ', JSON.parse( data ).version, '\n' );
		}
	);
};
