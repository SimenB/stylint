'use strict'

var fs = require( 'fs' )
var glob = require( 'glob' )
var async = require( 'async' )
var path = require( 'path' )
var Minimatch = require( 'minimatch' ).Minimatch

/**
 * @description globs files and returns an array, used in various methods
 * @param {string} [dir] directory of files to glob
 * @returns {Array} returns an array of files
*/
var getFiles = function( dir ) {
	if ( typeof dir !== 'string' ) {
		throw new TypeError( 'getFiles err. Expected string, but received: ' + typeof dir )
	}
	
	this.config.exclude = ( this.config.exclude || [] ).map( function( exclude ) {
		return new Minimatch( exclude, {
			matchBase: true
		} )
	} )

	glob( dir, {}, function( err, files ) {
		if ( err ) { throw err }
		files = files.filter( function( file ) {
			var excluded = false,
				relPath = path.relative( dir.replace( '/**/*.styl', '' ), file )
			
			this.config.exclude.forEach( function( exclude ) {
				excluded = excluded || exclude.match( relPath )
			} )
			
			return !excluded
		}, this )
		this.cache.filesLen = files.length - 1
		this.cache.files = files
		return async.map( this.cache.files, fs.readFile, this.parse.bind( this ) )
	}.bind( this ) )
}

module.exports = getFiles
