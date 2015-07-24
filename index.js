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
var stylint = function( path, config ) {
	var Lint

	Lint = stampit().compose(
		require( './src/core/' ),
		require( './src/checks/' ),
		require( './src/state/' ),
		stampit().enclose( function() {
			this.state.path = path ? path : ''
			this.customConfig = config ? config : false
		} ).enclose( require( './src/core/init' ) )
	)

	return Lint
}

var api = function( config ) {
	return stylint().create( {}, { config: config } )
}

module.exports = stylint
module.exports.api = api
