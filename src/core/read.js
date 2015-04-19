'use strict';

var fs = require('fs');

/**
 * @description determines what files to read, creates an array of them, and passes it to be parsed
 * @param {object} [app] [basically the whole app]
 * @param {string} [dir] [shorthand for app.state.dir, param so its easier to test]
 * @returns parse function
 */
module.exports = function read() {
	// if nothing passed in, default to linting the curr dir
	// here we get all the files to parse first, then we pass to app.parse
	if ( this.state.dir === process.cwd() ) {
		console.log( this.state.dir );
		return this.getFiles( this.state.dir + '/**/*.styl' );
	}
	/**
	 * else we'll have either a filename or dir name to work with
	 * if directory we use the glob logic to return an array of files to test
	 */
	else {
		fs.stat(this.state.dir, function( err, stats ) {
			if ( stats.isFile() ) {
				console.log( stats );
				// app.cache.file =
				return this.parse( app, this.state.dir, 1, 1 );
			}

			return this.getFiles( this.state.dir + '/**/*.styl' );
		}.bind(this));
	}
};
