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
var stampit  = require('stampit');

// let there be light ( * )
// basically, with stampit we take a bunch of different objects
// and methods and compose them into one mega object
// appropriately namespaced, with methods on the prototype, and this set correctly

module.exports = function( path, config ) {
	var customPath;
	var customConfig;

	if ( path ) {
		customPath = stampit().state({
			path: path,
		});
	}
	if ( config ) {
		customPath = stampit().state({
			config: config,
		});
	}

	var Lint = stampit().compose(
		require('./src/data/'),
		require('./src/core/'),
		require('./src/core/methods/lint'),
		require('./src/core/methods/state'),
		require('./src/core/methods/utils'),
		customPath,
		customConfig,
		stampit().enclose( require('./src/core/init') )
	);

	return Lint;
};
