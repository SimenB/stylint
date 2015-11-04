'use strict'

var fs = require( 'fs' )
var path = require( 'path' )
var pathIsAbsolute = require( 'path-is-absolute' )
var stripJsonComments = require( 'strip-json-comments' )

// @TODO i just this sloppy just to fix some stuff
// comes back and refactor / cleanup

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
	var customPath = ''
	// return default config if nothing passed in or found
	var returnConfig

	// used as a last resort
	// x-platform home directory getter
	var _getUserHome = function() {
		return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
	}

	/**
	 * @description sets the return config if one if found
	 * @param  {string} path [where to look for config]
	 * @return {Object|void} [object if stylintrc found, undefined if not]
	 */
	var _parseConfig = function( path ) {
		return JSON.parse(
			stripJsonComments(
				fs.readFileSync( path, 'utf-8' )
			)
		)
	}

	// if 1, the customConfig will be what we want
	// this only occurs if using stylint programmatically
	if ( this.customConfig ) {
		returnConfig = this.customConfig
	}
	// if 2, we pass in a path to the config
	// this only occurs if using stylint via the command line
	else if ( configpath ) {
		customPath = pathIsAbsolute( configpath ) ? configpath : process.cwd() + '/' + configpath
		try {
			returnConfig = _parseConfig( customPath )
		}
		catch ( err ) {
			throw err
		}
	}
	else {
		try {
			// check current working directory for .stylintrc
			files = fs.readdirSync( process.cwd() )
			if ( files.indexOf( '.stylintrc' ) !== -1 ) {
				returnConfig = _parseConfig( process.cwd() + '/.stylintrc' )
			}

			if ( !returnConfig ) {
				// go up 1 directory
				customPath = path.join( process.cwd(), '..' )
				files = fs.readdirSync( customPath )
				if ( files.indexOf( '.stylintrc' ) !== -1 ) {
					returnConfig = _parseConfig( customPath + '/.stylintrc' )
				}
			}

			if ( !returnConfig ) {
				// go up 1 more mdirectory
				customPath = path.join( process.cwd(), '..', '..' )
				files = fs.readdirSync( customPath )
				if ( files.indexOf( '.stylintrc' ) !== -1 ) {
					returnConfig = _parseConfig( customPath + '/.stylintrc' )
				}
			}

			if ( !returnConfig ) {
				// if nothing found in project, we look at the users home directory
				files = fs.readdirSync( _getUserHome() )
				if ( files.indexOf( '.stylintrc' ) !== -1 ) {
					returnConfig = _parseConfig( _getUserHome() + '/.stylintrc' )
				}
			}

			// default config if nothing found
			if ( !returnConfig ) {
				returnConfig = this.config
			}
		}
		// in case theres an issue parsing or no .stylintrc found at specified location
		catch ( err ) {
			throw err
		}
	}

	// 4, just return the initial config if nothing found
	return returnConfig
}

module.exports = setConfig
