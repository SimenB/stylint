'use strict'

var fs = require( 'fs' )
var async = require( 'async' )
var path = require( 'path' )
var globUtil = require( '@simenb/eslint-file-util/lib/util/glob-util' )

/**
 * @description globs files and returns an array, used in various methods
 * @param {string} [dir] directory of files to glob
 * @returns {Array} returns an array of files
*/
var getFiles = function( dir ) {
	if ( typeof dir !== 'string' && !( dir instanceof Array ) ) {
		throw new TypeError( 'getFiles err. Expected string or array, but received: ' + typeof dir )
	}

	var arrayOfDirs = Array.isArray( dir ) ? dir : [dir]

	var globPatterns = globUtil.resolveFileGlobPatterns( arrayOfDirs, { extensions: ['.styl'] } )
	var files = globUtil.listFilesToProcess( globPatterns )

	files = files
		.filter( function( file ) {
			return !file.ignored
		} )
		.map( function( file ) {
			return file.filename
		} )
		.filter( function( file ) {
			var excluded = false
			var relPath = path.dirname( file )

			this.config.exclude.forEach( function( exclude ) {
				excluded = excluded || exclude.match( relPath )
			} )

			return !excluded
		}, this )

	this.cache.filesLen = files.length - 1
	this.cache.files = files

	return async.map( this.cache.files, fs.readFile, this.parse.bind( this ) )
}

module.exports = getFiles
