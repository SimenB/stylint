#!/usr/bin/env node

/**
 * Stylint
 * @description A basic, configurable, node based, stylus linter cli
 *              app flow below
 *              read() -> parse() -> test() -> done()
 *              watch() -> read() -> parse() -> test() -> done()
*/

'use strict';

// all modules go here
var
	// core modules or npm
	done              = require('./src/done'),
	fs                = require('fs'),
	glob              = require('glob').Glob,
	help              = require('./src/help'),
	osType            = require('os').type().toLowerCase(),
	parse             = require('./src/parse'),
	pathIsAbsolute    = require('path-is-absolute'),
	read              = require('./src/read'),
	stampit           = require('stampit'),
	test              = require('./src/test'),
	ver               = require('./src/version'),
	watch             = require('./src/watch'),
	// linter tests below
	alphabet          = require('./src/checks/alphabet'),
	block             = require('./src/checks/block'),
	borderNone        = require('./src/checks/borderNone'),
	brackets          = require('./src/checks/brackets'),
	colon             = require('./src/checks/colon'),
	comma             = require('./src/checks/comma'),
	commentSpace      = require('./src/checks/commentSpace'),
	commentExists     = require('./src/checks/commentExists'),
	cssLiteral        = require('./src/checks/cssLiteral'),
	duplicates        = require('./src/checks/duplicates'),
	efficient         = require('./src/checks/efficient'),
	extend            = require('./src/checks/extends'),
	hashEnd           = require('./src/checks/hashEnd'),
	hashStart         = require('./src/checks/hashStart'),
	colors            = require('./src/checks/colors'),
	leadingZero       = require('./src/checks/leadingZero'),
	mixed             = require('./src/checks/mixed'),
	namingConvention  = require('./src/checks/namingConvention'),
	nesting           = require('./src/checks/nesting'),
	paren             = require('./src/checks/paren'),
	placeholder       = require('./src/checks/placeholder'),
	quotes            = require('./src/checks/quotes'),
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
 * this is what the linter will run when no config file is passed
 */
var config = stampit().state({
	config: {
		alphabetical: true, // check that properties are sorted alphabetically
		borderNone: true, // check for use of border none and recommend border 0
		brackets: true, // check for { or }, unless used in a hash
		colons: false, // check for unecessary colons
		colors: false, // check for hex colors used without variables
		commaSpace: true, // check for spaces after commas (0, 0, 0, .18)
		commentSpace: false, // check for space after line comment
		cssLiteral: false, // if true disallow css literals
		depthLimit: false, // set a maximum selector depth (dont nest more than 4 deep)
		duplicates: true, // check if properties or selectors are duplicate
		efficient: true, // check for margin 0 0 0 0 and recommend margin 0
		emoji: false, // toggle emoji on or off
		enforceVarStyle: false, // check for $ when declaring vars (doesnt check use)
		enforceBlockStyle: false, // check for @block when defining blocks
		extendPref: false, // prefer a specific syntax when using @extends (or @extend)
		globalDupe: false, // throw duplicate selector warning across all files instead of curr file
		indentSpaces: 4, // how many spaces should we prefer when indenting, pass in false if hard tabs
		leadingZero: true, // find cases where 0.# is used, prefer .#
		maxWarnings: 10, // should we have a max amount of warnings, and error out if we go over
		maxWarningsKill: false, // if over maxWarning count, kill process
		mixed: false, // check for mixed spaces and tabs
		namingConvention: false, // lowercase-dash, camelCase, lowercase_underscore, BEM or false (dont check)
		namingConventionStrict: false, // if true, then check classes and ids, if false just check variables
		parenSpace: false, // check for extra space inside parens when defining or using mixins
		placeholders: true, // only allow @extending of placeholder vars
		quotePref: false, // single or double quotes, or false to not check
		semicolons: false, // check for unecessary semicolons
		trailingWhitespace: true, // check for trailing whitespace
		universal: true, // check for use of * and recommend against it
		valid: false, // check if prop or value is a valid assignment
		zeroUnits: true, // check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
		zIndexDuplicates: false, // just find duplicate z index values
		zIndexNormalize: false // suggest a normalized z index value, base of whatever this is
	}
});


// flags for the cli
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
 * @return {Object} [i expose properties to the entire app]
 */
var state = stampit().state({
	cache: {
		alphaCache: [],
		prevContext: 0,
		prevFile: '',
		prevLine: '',
		rootCache: [],
		selectorCache: [],
		warnings: [],
		zCache: []
	},
	state: {
		cssBlock: false,
		dir: undefined,
		exitCode: 0,
		hash: false,
		strictMode: false,
		testsEnabled: true, // are we running linter tests
		toggleBlock: false, // @stylint off
		watching: false
	}
});


/**
 * @description i hold the functionality
 * @return {Object} [i expose the modules to the entire app, so we only do it once]
 */
var coreMethods = stampit().methods({
	emojiAllClear: function( emoji, os ) {
		if ( emoji || this.config.emoji === true ) {
			if ( os || osType.indexOf('windows') >= 0 ) {
				return ':)';
			}
			else {
				return '\uD83D\uDC4D  ';
			}
		}
		else {
			return '';
		}
	},
	emojiWarning: function( emoji, os ) {
		if ( emoji || this.config.emoji === true ) {
			if ( os || osType.indexOf('windows') >= 0 ) {
				return ':(';
			}
			else {
				return '\uD83D\uDCA9  ';
			}
		}
		else {
			return '';
		}
	},
	getFiles: function( path ) {
		if ( typeof path !== 'string' ) {
			throw TypeError('Path needs to be a string');
		}

		glob(path, {}, function( err, files ) {
			if ( err ) { throw err; }
			var len = files.length - 1;

			files.forEach(function( file, i ) {
				return this.parse( this, file, len, i );
			}.bind( this ));
		}.bind( this ));
	},
	setConfig: function( path ) {
		path = pathIsAbsolute( path ) ? path : process.cwd() + '/' + path;
		return JSON.parse( fs.readFileSync( path ) );
	},
	done: done,
	help: help,
	read: read,
	parse: parse,
	test: test,
	ver: ver,
	watch: watch
});


// very simple, 1 purpose methods, that run regex/indexOf checks on strings
var testMethods = stampit().methods({
	alphabet: alphabet,
	block: block,
	borderNone: borderNone,
	brackets: brackets,
	colon: colon,
	colors: colors,
	comma: comma,
	commentSpace: commentSpace,
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
	quotes: quotes,
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


// let us 'share' our light with others
module.exports = Lint;
