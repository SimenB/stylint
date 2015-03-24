'use strict';

var fs = require('fs');

/**
 * @description determines what files to read, creates an array of them, and passes it to be parsed
 * @param {object} [app] [basically the whole app]
 * @param {string} [dir] [shorthand for app.state.dir, param so its easier to test]
 * @returns parse function
 */
module.exports = function read( app, path ) {
	// if nothing passed in, default to linting the curr dir
	// here we get all the files to parse first, then we pass to app.parse
	if ( path === process.cwd() ) {
		app.getFiles( path + '/**/*.styl' );
	}
	/**
	 * else we'll have either a filename or dir name to work with
	 * if directory we use the glob logic to return an array of files to test
	 */
	else {
		fs.stat(path, function( err, stats ) {
			if ( err ) { throw err; }

			if ( stats.isFile() ) {
				return app.parse( app, path, 1, 1 );
			}
			else if ( stats.isDirectory() ) {
				app.getFiles( path + '/**/*.styl' );
			}
		});
	}
}
