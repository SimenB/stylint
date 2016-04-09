'use strict'

// our stampit modules
var stampit = require( 'stampit' )

// let there be light ( * )
// basically, with stampit we take a bunch of different objects
// and methods and compose them into one mega object, the app
// appropriately namespaced, with methods on the prototype, and this set correctly
// basic app flow below
// init() -> read() -> parse() -> lint() -> done()
// init() -> watch() -> read() -> parse() -> lint() -> done()


/**
 * main stylint kickoff function
 * @param {string} path   [custom path if used programmatically]
 * @param {object} config [config if used programmatically]
 * @param {function} [callback] [a callback called just before exiting the process if not watching]
 * @return {Object} [the composed stylint object]
 */
var Stylint = function( path, config, callback ) {
	var Lint

	Lint = stampit().compose(
		require( './src/core/' ),
		require( './src/checks/' ),
		require( './src/state/' ),
		stampit().enclose( function() {
			this.state.path = typeof path === 'string' ? path : './'
			this.customConfig = typeof config === 'object' ? config : false
			this.callback = callback || function() {}
		} ).enclose( require( './src/core/init' ) )
	)

	return Lint
}

module.exports = Stylint
