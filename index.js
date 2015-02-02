#!/usr/bin/env node

/**
 * Stylus Lint (splinter) (the p is silent)
 * @description A basic, configurable, node based, stylus linter cli
 *              read() -> parse() -> test() -> done()
 *              or
 *              watch() -> read() -> parse() -> test() -> done()
 * @flow
*/

'use strict';

// all modules go here
var
	stampit = require('stampit'),
	fs = require('fs'),
	glob = require('glob').Glob,
	done = require('./src/done'),
	help = require('./src/help'),
	read = require('./src/read'),
	parse = require('./src/parse'),
	test = require('./src/test'),
	ver = require('./src/version'),
	watch = require('./src/watch'),
	alphabet          = require('./src/checks/alphabet'),
	block             = require('./src/checks/block'),
	borderNone        = require('./src/checks/borderNone'),
	brackets          = require('./src/checks/brackets'),
	colon             = require('./src/checks/colon'),
	comma             = require('./src/checks/comma'),
	comment           = require('./src/checks/comment'),
	commentExists     = require('./src/checks/commentExists'),
	cssLiteral        = require('./src/checks/cssLiteral'),
	duplicates        = require('./src/checks/duplicates'),
	efficient         = require('./src/checks/efficient'),
	extend            = require('./src/checks/extends'),
	hashEnd           = require('./src/checks/hashEnd'),
	hashStart         = require('./src/checks/hashStart'),
	leadingZero       = require('./src/checks/leadingZero'),
	mixed             = require('./src/checks/mixed'),
	namingConvention  = require('./src/checks/namingConvention'),
	nesting           = require('./src/checks/nesting'),
	paren             = require('./src/checks/paren'),
	placeholder       = require('./src/checks/placeholder'),
	semicolon         = require('./src/checks/semicolon'),
	startsWithComment = require('./src/checks/startsWithComment'),
	universal         = require('./src/checks/universal'),
	valid             = require('./src/checks/valid'),
	varStyle          = require('./src/checks/var'),
	whitespace        = require('./src/checks/trailingWhitespace'),
	zeroUnits         = require('./src/checks/zeroUnits'),
	zIndexDupe        = require('./src/checks/zIndexDupe'),
	zIndexNormalize   = require('./src/checks/zIndexNormalize');


/**
 * configuration related properties
 */
var config = stampit().state({
	config: {
		'alphabetical': true, // check that properties are sorted alphabetically
		'borderNone': true, // check for use of border none and recommend border 0
		'brackets': true, // check for { or }, unless used in a hash
		'colons': false, // check for unecessary colons
		'commaSpace': true, // check for spaces after commas (0, 0, 0, .18)
		'commentSpace': false, // check for space after line comment
		'cssLiteral': false, // if true disallow css literals
		'depthLimit': false, // set a maximum selector depth (dont nest more than 4 deep)
		'duplicates': true, // check if properties or selectors are duplicate
		'efficient': true, // check for margin 0 0 0 0 and recommend margin 0
		'enforceVarStyle': false, // check for $ when declaring vars (doesnt check use)
		'enforceBlockStyle': false, // check for @block when defining blocks
		'extendPref': false, // prefer a specific syntax when using @extends (or @extend)
		'globalDupe': false, // throw duplicate selector warning across all files instead of curr file
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
		'valid': true, // check if prop or value is a valid assignment
		'zeroUnits': true, // check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
		'zIndexDuplicates': false, // just find duplicate z index values
		'zIndexNormalize': false // suggest a normalized z index value, base of whatever this is
	}
});


// flags for the app
var flags = stampit().state({
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
		'--help',
		'--harmony'
	]
});


/**
 * @description i hold the state
 * @todo prolly dont need so many arrays
 * @return {Object} [i expose properties to the entire app]
 */
var state = stampit().state({
	state: {
		cssBlock: false,
		dir: undefined,
		hash: false,
		strictMode: false,
		testsEnabled: true, // are we running linter tests
		toggleBlock: false // @stylint off
	},
	warnings: [],
	alphaCache: [],
	selectorCache: [],
	rootCache: [],
	zCache: [],
	prevLine: '',
	prevFile: '',
	prevContext: 0
});


/**
 * @description i hold the functionality
 * @return {Object} [i expose the modules to the entire app, so we only do it once]
 */
var coreMethods = stampit().methods({
	getFiles: function( path ) {
		var app = this;

		glob(path, {}, function( err, files ) {
			if ( err ) { throw err; }
			var len = files.length - 1;

			files.forEach(function( file, i ) {
				return app.parse( app, file, len, i );
			});
		});
	},
	setConfig: function( path ) {
		return JSON.parse( fs.readFileSync( process.cwd() + '/' + path ) );
	},
	done: done,
	help: help,
	read: read,
	parse: parse,
	test: test,
	ver: ver,
	watch: watch
});


var testMethods = stampit().methods({
	alphabet: alphabet,
	block: block,
	borderNone: borderNone,
	brackets: brackets,
	colon: colon,
	comma: comma,
	comment: comment,
	commentExists: commentExists,
	cssLiteral: cssLiteral,
	duplicates: duplicates,
	efficient: efficient,
	extend: extend,
	hashEnd: hashEnd,
	hashStart: hashStart,
	leadingZero: leadingZero,
	mixed: mixed,
	namingConvention: namingConvention,
	nesting: nesting,
	paren: paren,
	placeholder: placeholder,
	semicolon: semicolon,
	startsWithComment: startsWithComment,
	universal: universal,
	valid: valid,
	varStyle: varStyle,
	whitespace: whitespace,
	zeroUnits: zeroUnits,
	zIndexDupe: zIndexDupe,
	zIndexNormalize: zIndexNormalize
});


/**
 * @description i initialize everything
 * @return {Function} [calls the part of the app we want, depending on state]
 */
var init = stampit().enclose(function () {
	var configIndex;

	// if path/ passed in use that for the dir
	if ( process.argv[2] && this.flags.indexOf( process.argv[2] ) === -1 ) {
		this.state.dir = process.argv[2];
	}
	else {
		this.state.dir = process.cwd();
	}

	// display help message if user types --help
	if ( process.argv.indexOf('-h') !== -1 || process.argv.indexOf('--help') !== -1 ) {
		return this.help( this );
	}

	// output version # from package.json
	if ( process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1 ) {
		return this.ver( this, __dirname );
	}

	// turn on strict if strict flag passed
	if ( process.argv.indexOf('-s') !== -1 || process.argv.indexOf('--strict') !== -1 ) {
		this.state.strictMode = true;
	}

	// if -c or --config flags used
	if ( process.argv.indexOf('-c') !== -1 || process.argv.indexOf('--config') !== -1 ) {
		if ( process.argv.indexOf('-c') !== -1 ) {
			configIndex = process.argv.indexOf('-c');
		}
		else {
			configIndex = process.argv.indexOf('--config');
		}

		this.config = this.setConfig( process.argv[ configIndex + 1] );
	}

	// fire watch or read based on flag
	if ( process.argv.indexOf('-w') !== -1 || process.argv.indexOf('--watch') !== -1 ) {
		return this.watch( this, this.state.dir );
	}
	else {
		return this.read( this, this.state.dir );
	}
});


// var there be light ( * )
var Lint = stampit().compose(
	flags,
	config,
	state,
	coreMethods,
	testMethods,
	init
).create();


// var us 'share' our light with others
module.exports = Lint;
// export Lint;