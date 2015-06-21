var stampit = require( 'stampit' );

/**`
 * @description 'core' methods, the basic read -> parse -> test -> done cycle
 * @return {Function} just groups all modules in the core/ dir together
 */
var core = stampit().methods( {
	cache: require( './cache' ),
	state: require( './state' ),
	flags: require( './flags' ),
	config: require( './config' ),
	init: require( './init' ),
	done: require( './done' ),
	help: require( './help' ),
	read: require( './read' ),
	parse: require( './parse' ),
	setState: require( './setState' ),
	lint: require( './lint' ),
	ver: require( './ver' ),
	watch: require( './watch' )
	// watcher: undefined
} );

module.exports = core;
