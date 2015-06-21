'use strict';

var fs = require( 'fs' );
var pathIsAbsolute = require( 'path-is-absolute' );

/**
 * @description overrides default config with a new config object
 * @param {string} [potentialPath] location of our new config
 * @returns {Function} kick off linter again
*/
var setConfig = function( potentialPath ) {
	var path = '';

	if ( typeof potentialPath !== 'string' ) {
		throw new TypeError( 'setConfig err. Expected string, but received: ' + typeof dir );
	}

	path = pathIsAbsolute( potentialPath ) ? potentialPath : process.cwd() + '/' + potentialPath;
	return JSON.parse( fs.readFileSync( path ) );
};

module.exports = setConfig;
