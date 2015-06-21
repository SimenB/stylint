#!/usr/bin/env node

'use strict';

// our stampit modules
var stampit = require( 'stampit' );

// let there be light ( * )
// basically, with stampit we take a bunch of different objects
// and methods and compose them into one mega object, the app
// appropriately namespaced, with methods on the prototype, and this set correctly
// basic app flow below
// init() -> read() -> parse() -> lint() -> done()
// init() -> watch() -> read() -> parse() -> lint() -> done()
var Stylint = function( path, config ) {
	var Lint;

	Lint = stampit().compose(
		require( './src/core/' ),
		require( './src/checks/' ),
		require( './src/state/' ),
		// stampit().enclose( function() {
		// 	console.log( path );
		// 	console.log( config );
		//
		// 	if ( path ) {
		// 		this.state.path = path;
		// 	}
		//
		// 	if ( config ) {
		// 		this.customConfig = config;
		// 	}
		// } ),
		stampit().enclose( function() {
			if ( path ) {
				this.state.path = path;
			}

			if ( config ) {
				this.customConfig = config;
			}
		} ).enclose( require( './src/core/init' ) )
	);

	return Lint;
};

module.exports = Stylint;
