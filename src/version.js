'use strict';

var
	fs = require('fs'),
	chalk = require('chalk');

// called when --version or -v flags used, just displays version number
module.exports = function version( app, dir ) {
	return fs.readFile(dir + '/package.json',
		function( err, data ) {
			if ( err ) { throw err; }
			return console.log( chalk.blue('\nStylint version: '), JSON.parse( data ).version, '\n' );
		}
	);
}