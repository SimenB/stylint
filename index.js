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
	fs		= require('fs'),
	argv    = require('yargs').argv,	// cli cli cli
	loop	= require('./src/delay'),	// monitor event loop for slowdowns
	read 	= require('./src/read'),	// reads files
	parse 	= require('./src/parse'),   // parse the files
	test 	= require('./src/test'),    // run all enabled tests
	done 	= require('./src/done'),    // run all enabled tests
	help	= require('./src/help'),	// help messages
	ver		= require('./src/version'),	// version message
	watch	= require('./src/watch'), 	// file watcher, calls init on change
	stampit = require('stampit');


var state = stampit().state({
	config: {
        'borderNone': true, // check for use of border none and recommend border 0
        'brackets': false, // check for { or }, unless used in a hash
        'colons': false, // check for unecessary colons
        'commaSpace': true, // check for spaces after commas (0, 0, 0, .18)
        'commentSpace': false, // check for space after line comment
        'cssLiteral': false, // if true disallow css literals
        'depthLimit': 4, // set a maximum selector depth (dont nest more than 4 deep)
        'efficient': true, // check for margin 0 0 0 0 and recommend margin 0
        'enforceVarStyle': false, // check for $ when declaring vars (doesnt check use)
        'enforceBlockStyle': false, // check for @block when defining blocks
        'extendPref': false, // prefer a specific syntax when using @extends (or @extend)
        'indentSpaces': 4, // how many spaces should we prefer when indenting, pass in false if hard tabs
        'leadingZero': true, // find cases where 0.# is used, prefer .#
        'maxWarnings': 10, // should we have a max amount of warnings, and error out if we go over
        'mixed': false, // check for mixed spaces and tabs
        'namingConvention': false, // lowercase-dash, camelCase, lowercase-underscore, or false (dont check)
        'parenSpace': false, // check for extra space inside parens when defining or using mixins
        'placeholders': true, // only allow @extending of placeholder vars
        'semicolons': false, // check for unecessary semicolons
        'trailingWhitespace': true, // check for trailing whitespace
        'universal': true, // check for use of * and recommend against it
        'valid': false, // check if prop or value is a valid assignment
        'zeroUnits': true, // check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
        'zIndexr': false // find z index values and suggested a normalized value of 5 (so, 5 - 10 - 15 - 20 )
    },
    flags: [
        '-c',
        '-w',
        '-s',
        '-v',
        '-h',
        '--config',
        '--watch',
        '--strict',
        '--version',
        '--help'
    ],
    state: {
    	config: argv.c || argv.config,
    	cssBlock: false,
    	dir: process.argv[2],
    	done: false,
    	help: argv.help || argv.h,
    	hash: false,
    	stateOverride: false,
    	strictMode: false,
    	testsEnabled: true,
    	toggleBlock: false,
    	watch: argv.watch || argv.w,
    	version: argv.version || argv.v
    },
    warnings: []
});


var methods = stampit().enclose(function () {
	return stampit.extend(this, {
		done: done,
		help: help,
		read: read,
		parse: parse,
		test: test,
		watch: watch,
		ver: ver
	});
});


var init = stampit().enclose(function () {
	var app = this; // for readFile

	// kickoff linter, default to linting curr dir if no file or dir passed
	this.kickoff = function() {
		if ( app.state.watch ) {
			return app.watch( this.dir );
		}
		else {
			return app.read( this.dir );
		}
	}

	// display help message if user types --help
	if ( this.state.help ) {
		return this.help();
	}

	// output version # from package.json
	if ( this.state.version ) {
		return this.ver();
	}

	if ( argv.s || argv.strict ) {
	    this.state.strictMode = true;
	}

	// if -c or --config flags used
	if ( this.state.config ) {
	    fs.readFile( app.state.config, function( err, data ) {
	        if ( err ) { throw err; }
	        app.config = JSON.parse( data );
	        return this.kickoff();
	    });
	}
	// else default kickoff
	else {
		return this.kickoff();
	}
});


var Lint = stampit().compose( methods, state, init ).create();