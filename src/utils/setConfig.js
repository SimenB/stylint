'use strict'

var fs = require( 'fs' )
var pathIsAbsolute = require( 'path-is-absolute' )
var stripJsonComments = require( 'strip-json-comments' )

/**
 * @description overrides default config with a new config object
 * 4 potential options here.
 * 1: user passed in config object via node module
 * 2: user passes location of .stylintrc file to use
 * 3: user has a .stylintrc file in their dir but doesnt pass anything
 * 4: none of the above, fallback to initial config
 * @param {String} [configpath] If defined, the path to a config-file to read
 * @returns {Function} kick off linter again
*/
var setConfig = function( configpath ) {
	var files = []
	var path = ''
	var returnConfig = this.config

	// if 1, the customConfig will be what we want
	if ( this.customConfig ) {
		returnConfig = this.customConfig
	}
	// if 2
	else if ( configpath ) {
		path = pathIsAbsolute( configpath ) ? configpath : process.cwd() + '/' + configpath
		try {
			returnConfig = JSON.parse( stripJsonComments( fs.readFileSync( path, 'utf-8' ) ) )
		}
		catch ( err ) {
			throw err
		}
	}
	// if 3
	else {
		try {
			files = fs.readdirSync( process.cwd() )
			if ( files.indexOf( '.stylintrc' ) !== -1 ) {
				returnConfig = JSON.parse( stripJsonComments( fs.readFileSync( process.cwd() + '/.stylintrc', 'utf-8' ) ) )
			}
		}
		// in case theres an issue parsing
		catch ( err ) {
			throw err
		}
	}

	// 4, just return the initial config
	return returnConfig
}

module.exports = setConfig
