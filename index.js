#!/usr/bin/env node

/**
 * Stylint
 * @description A basic, configurable, node based, stylus linter cli
 *              app flow below
 *              read() -> parse() -> test() -> done()
 *              watch() -> read() -> parse() -> test() -> done()
*/

'use strict';

// our stampit modules
var stampit = require( 'stampit' );

// let there be light ( * )
// basically, with stampit we take a bunch of different objects
// and methods and compose them into one mega object
// appropriately namespaced, with methods on the prototype, and this set correctly
var Stylint = function( path, config ) {
	var Lint;
	var customPath;
	var customConfig;

	if ( path ) {
		customPath = stampit().state( {
			state: {
				path: path
			}
		} );
	}

	if ( config ) {
		customConfig = stampit().state( {
			config: config
		} );
	}

	// compose together the following:
	// 1 all utility methods
	// 2 all core methods
	// 3 methods dealing with state
	// 4 methods that output warnings/errors
	// 5 custom path/ if one passed in via module
	// 6 custom config if one passed in via module
	// 7 kickoff function, handles routing etc
	Lint = stampit().compose(
		require( './src/core/' ),
		require( './src/checks/' ),
		require( './src/state/' ),
		// require( './src/utils/' ),
		customPath,
		customConfig,
		stampit().enclose( require( './src/core/init' ) )
	);

	return Lint;
};

module.exports = Stylint;
