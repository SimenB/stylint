'use strict';

var fs = require( 'fs' );
var pathIsAbsolute = require( 'path-is-absolute' );

/**
 * @description overrides default config with a new config object
 * 4 potential options here.
 * 1: user passed in config object via node module
 * 2: user passes location of .stylintrc file to use
 * 3: user has a .stylintrc file in their dir but doesnt pass anything
 * 4: none of the above, fallback to initial config
 * @param {string} [potentialPath] location of our new config
 * @returns {Function} kick off linter again
*/
var setConfig = function() {
	var path = '';
	var potentialPath = '';
	var flag = process.argv.indexOf( '--config' ) !== -1 || process.argv.indexOf( '-c' ) !== -1;

	// if 1, the customConfig will be what we want
	if ( this.customConfig ) {
		return this.customConfig;
	}
	// if 2
	else if ( flag ) {
		if ( process.argv.indexOf( '--config' ) !== -1 ) {
			potentialPath = process.argv[process.argv.indexOf( '--config' ) + 1];
		}
		else {
			potentialPath = process.argv[process.argv.indexOf( '-c' ) + 1];
		}

		path = pathIsAbsolute( potentialPath ) ? potentialPath : process.cwd() + '/' + potentialPath;
		return JSON.parse( fs.readFileSync( path ) );
	}

	// 4, just return the initial config
	return this.config;
};

module.exports = setConfig;
