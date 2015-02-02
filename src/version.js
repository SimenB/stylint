'use strict';

var fs = require('fs');

// called when --version or -v flags used, just displays version number
module.exports = function version( app, dir ) {
	return fs.readFile(dir + '/package.json',
		function( err, data ) {
			if ( err ) { throw err; }
			return console.log( '\nStylint version: ', JSON.parse( data ).version, '\n' );
		}
	);
}