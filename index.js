#!/usr/bin/env node

/**
 * Stylus Lint (splinter) (the p is silent)
 * @description A basic, configurable, node based, stylus linter cli
 *              init() -> read() -> parse() -> test() -> done()
 *              or
 *              watch() -> init() -> read() -> parse() -> test() -> done()
 * @flow
*/


const
	argv    = require('yargs').argv,	// cli cli cli
	loop	= require('./src/delay'),	// monitor event loop for slowdowns
	init	= require('./src/init'), 	// kicks off app
	help	= require('./src/help'),	// help messages
	ver		= require('./src/version'),	// version message
	watch	= require('./src/watch'); 	// file watcher, calls init on change
	// config = {
	//     'borderNone': true, // check for use of border none and recommend border 0
	//     'brackets': true, // check for { or }, unless used in a hash
	//     'colons': false, // check for unecessary colons
	//     'commaSpace': true, // check for spaces after commas (0, 0, 0, .18)
	//     'commentSpace': false, // check for space after line comment
	//     'cssLiteral': false, // if true disallow css literals
	//     'depthLimit': 4, // set a maximum selector depth (dont nest more than 4 deep)
	//     'efficient': true, // check for margin 0 0 0 0 and recommend margin 0
	//     'enforceVarStyle': false, // check for $ when declaring vars (doesnt check use)
	//     'enforceBlockStyle': false, // check for @block when defining blocks
	//     'extendPref': false, // prefer a specific syntax when using @extends (or @extend)
	//     'indentSpaces': 4, // how many spaces should we prefer when indenting, pass in false if hard tabs
	//     'leadingZero': true, // find cases where 0.# is used, prefer .#
	//     'maxWarnings': 10, // should we have a max amount of warnings, and error out if we go over
	//     'mixed': false, // check for mixed spaces and tabs
	//     'namingConvention': false, // lowercase-dash, camelCase, lowercase-underscore, or false (dont check)
	//     'parenSpace': false, // check for extra space inside parens when defining or using mixins
	//     'placeholders': true, // only allow @extending of placeholder vars
	//     'semicolons': false, // check for unecessary semicolons
	//     'trailingWhitespace': true, // check for trailing whitespace
	//     'universal': true, // check for use of * and recommend against it
	//     'valid': true, // check if prop or value is a valid assignment
	//     'zeroUnits': true // check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
	// };


// display help message if user types --help
if ( argv.help || argv.h ) {
	return help();
}

// output version # from package.json
if ( argv.version || argv.v ) {
	return ver();
}

// kickoff linter, default to linting curr dir if no file or dir passed
if ( !argv.v && !argv.h && !argv.version && !argv.help ) {
	// if config flag passed
	if ( argv.c || argv.config ) {
		// if config and watch passed
		if ( argv.watch || argv.w ) {
			if ( !process.argv[2] ) {
				return watch( 'nothing', argv.c ? argv.c : argv.config );
			}
			// else lint what was passed
			else {
				return watch( process.argv[2], argv.c ? argv.c : argv.config );
			}
		}
		// else just config passed
		else {
			if ( !process.argv[2] ) {
				return init( 'nothing', argv.c ? argv.c : argv.config );
			}
			// else lint what was passed
			else {
				return init( process.argv[2], argv.c ? argv.c : argv.config );
			}
		}
	}
	// if watch flag passed
	else if ( argv.watch || argv.w ) {
		if ( !process.argv[2] ) {
			return watch( 'nothing' );
		}
		// else lint what was passed
		else {
			return watch( process.argv[2] );
		}
	}
	// no flags
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