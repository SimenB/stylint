'use strict';

/**
 * @description initialization function, does routing and kicks it all off
 * @return {Function} always returns a function, determined by cli flags
 */
var init = function() {
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
	if ( process.argv.indexOf( '--help' ) !== -1 ) {
		return this.help();
	}

	// output version # from package.json
	if ( process.argv.indexOf( '--version' ) !== -1 ) {
		return this.ver();
	}

	// turn on strict if strict flag passed
	if ( process.argv.indexOf( '--strict' ) !== -1 || this.config.strictMode ) {
		this.state.strictMode = true;
	}

	// if -c flag used
	if ( process.argv.indexOf( '--config' ) !== -1 ) {
		this.config = this.setConfig( process.argv[process.argv.indexOf( '--config' ) + 1] );
	}

	// fire watch or read based on flag
	if ( process.argv.indexOf( '--watch' ) !== -1 ) {
		return this.watch();
	}

	return this.read();
};

module.exports = init;
