'use strict';

/**
 * @description initialization function, does routing and kicks it all off
 * @return {Function} always returns a function, determined by cli flags
 */
var init = function() {
	// these are all pretty much just for convenience
	var v = process.argv;
	var watch = v.indexOf( '--watch' ) !== -1 || v.indexOf( '-w' ) !== -1;
	var help = v.indexOf( '--help' ) !== -1 || v.indexOf( '-h' ) !== -1;
	var version = v.indexOf( '--version' ) !== -1 || v.indexOf( '-v' ) !== -1;

	// look for flags by default
	// then look for .stylintrc in project dir as fallback
	// else just use default config
	this.config = this.setConfig();

	// we do the check here just in case
	// they don't pass in a reporter when using a custom config
	if ( this.config.reporter ) {
		this.reporter = require( this.config.reporter );
	}
	else {
		this.reporter = require( './reporter' );
	}

	// if path/ passed in use that for the dir
	if ( typeof this.state.path !== 'undefined' &&
		process.argv[2] && this.flags.indexOf( process.argv[2] ) === -1 ) {
		this.state.path = process.argv[2];
	}
	else {
		this.state.path = process.cwd();
	}

	// display help message if user types --help
	if ( help ) {
		return this.help();
	}

	// output version # from package.json
	if ( version ) {
		return this.ver();
	}

	// fire watch or read based on flag
	if ( watch ) {
		return this.watch();
	}

	return this.read();
};

module.exports = init;
