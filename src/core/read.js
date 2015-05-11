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
	if ( this.state.path === process.cwd() ) {
		return this.getFiles(this.state.path + '/**/*.styl');
	}

	/**
	 * else we'll have either a filename or dir name to work with
	 * if directory we use the glob logic to return an array of files to test
	 */
	return fs.stat(this.state.path, function(err, stats) {
		if ( !stats ) {
			throw Error('Stylint Error: No such file or dir exists');
		}

		if ( stats.isFile() ) {
			this.cache.filesLen = 1;
			this.cache.fileNo = 1;
			this.cache.file = this.state.path;
			return this.parse();
		}
		else {
			// else it's a directory, so pass a glob to getFiles
			return this.getFiles( this.state.path + '/**/*.styl' );
		}
	}.bind(this));
};
