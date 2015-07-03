'use strict'

var fs = require( 'fs' )
var async = require( 'async' )


/**
 * @description determines what files to read, creates an array of them, and passes it to be parsed
 * @returns {Function} parse function
 */
var read = function() {
	// if nothing passed in, default to linting the curr dir
	// here we get all the files to parse first, then we pass to app.parse
	if ( this.state.path === process.cwd() ) {
		return this.getFiles( this.state.path + '/**/*.styl' )
	}

	// else we'll have either a filename or dir name to work with
	// if dir we use the glob logic to return an array of files to test
	return fs.stat( this.state.path, function( err, stats ) {
		if ( !stats || err ) {
			throw Error( 'Stylint Error: No such file or dir exists!' )
		}

		if ( stats.isFile() ) {
			this.cache.filesLen = 1
			this.cache.fileNo = 1
			this.cache.file = this.state.path
			this.cache.files = [this.state.path]
			return async.map( this.cache.files, fs.readFile, this.parse.bind( this ) )
		}
		if ( stats.isDirectory() ) {
			return this.getFiles( this.state.path + '/**/*.styl' )
		}
	}.bind( this ) )
}

module.exports = read
