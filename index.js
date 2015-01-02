#!/usr/bin/env node

/**
 * Stylus Lint (splinter) (the p is silent)
 * @description A basic, configurable, node based, stylus linter cli
 *              init() -> read() -> parse() -> test() -> done()
 * @flow
*/


const
	argv    = require('yargs').argv,	// cli cli cli
	loop	= require('./src/delay'),	// monitor event loop for slowdowns
	init	= require('./src/init'), 	// kicks off app
	help	= require('./src/help'),	// help messages
	ver		= require('./src/version'),	// version message
	watch	= require('./src/watch'); 	// file watcher, calls init on change


// display help message if user types --help
if ( argv.help || argv.h ) {
	return help();
}

// output version # from package.json
if ( argv.version || argv.v ) {
	return ver();
}

// if --watch flag passed, set up file watcher
if ( argv.watch || argv.w ) {
	return watch();
}

// kickoff linter, default to linting curr dir if no file or dir passed
if ( !argv.v && !argv.h && !argv.version && !argv.help ) {
	if ( argv.c || argv.config ) {
		if ( !process.argv[2] ) {
			return init( 'nothing', argv.c ? argv.c : argv.config );
		}
		// else lint what was passed
		else {
			return init( process.argv[2], argv.c ? argv.c : argv.config );
		}
	}
	else {
		if ( !process.argv[2] ) {
			return init( 'nothing' );
		}
		// else lint what was passed
		else {
			return init( process.argv[2] );
		}
	}
}


// get event loop delays in ms
// loop();