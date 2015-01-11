#!/usr/bin/env node

/**
 * Stylus Lint (splinter) (the p is silent)
 * @description A basic, configurable, node based, stylus linter cli
 *              read() -> parse() -> test() -> done()
 *              or
 *              watch() -> read() -> parse() -> test() -> done()
 * @flow
*/


// all modules go here
const
	argv    = require('yargs').argv,
	stampit = require('stampit'),
    fs = require('fs'),
    chalk = require('chalk'),
    glob = require('glob').Glob,
    done = require('./src/done'),
    help = require('./src/help'),
    read = require('./src/read'),
    parse = require('./src/parse'),
    test = require('./src/test'),
    ver = require('./src/version'),
    watch = require('./src/watch'),
    blockStyleCorrect       = require('./src/checks/checkBlockStyle'),
    brackets                = require('./src/checks/checkForBrackets'),
    checkBorderNone         = require('./src/checks/checkBorderNone'),
    colon                   = require('./src/checks/checkForColon'),
    commaStyleCorrect       = require('./src/checks/checkCommaStyle'),
    commentStyleCorrect     = require('./src/checks/checkCommentStyle'),
    cssLiteral              = require('./src/checks/checkForCssLiteral'),
    efficient               = require('./src/checks/checkForEfficiency'),
    extendStyleCorrect      = require('./src/checks/checkForExtendStyle'),
    hasComment              = require('./src/checks/checkForComment'),
    hashEnding              = require('./src/checks/checkForHashEnd'),
    hashStarting            = require('./src/checks/checkForHashStart'),
    leadingZero             = require('./src/checks/checkForLeadingZero'),
    mixedSpacesAndTabs      = require('./src/checks/checkForMixedSpacesTabs'),
    namingConvention        = require('./src/checks/checkNamingConvention'),
    parenStyleCorrect       = require('./src/checks/checkForParenStyle'),
    placeholderStyleCorrect = require('./src/checks/checkForPlaceholderStyle'),
    semicolon               = require('./src/checks/checkForSemicolon'),
    startsWithComment       = require('./src/checks/checkForCommentStart'),
    tooMuchNest             = require('./src/checks/checkNesting'),
    universalSelector       = require('./src/checks/checkForUniversal'),
    whitespace              = require('./src/checks/checkForTrailingWhitespace'),
    validProperty           = require('./src/checks/checkForValidProperties'),
    validValue              = require('./src/checks/checkForValidValues'),
    varStyleCorrect         = require('./src/checks/checkVarStyle'),
    zeroUnits               = require('./src/checks/checkForZeroUnits'),
    zIndexr                 = require('./src/checks/zIndexr'),
    validCSS                = require('./src/checks/validCSS'),
    validHTML               = require('./src/checks/validHTML');


/**
 * configuration related properties
 */
var config = stampit().state({
    config: {
        'borderNone': true, // check for use of border none and recommend border 0
        'brackets': false, // check for { or }, unless used in a hash
        'colons': false, // check for unecessary colons
        'commaSpace': true, // check for spaces after commas (0, 0, 0, .18)
        'commentSpace': false, // check for space after line comment
        'cssLiteral': false, // if true disallow css literals
        'depthLimit': false, // set a maximum selector depth (dont nest more than 4 deep)
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
    }
});


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
        '--help'
    ]
});


/**
 * @description i hold the functionality
 * @return {Object} [i expose all of our modules to the entire app]
 */
var state = stampit().state({
    state: {
    	config: argv.c ? argv.c : argv.config,
    	cssBlock: false,
    	dir: process.cwd(),
    	done: false,
    	help: argv.h ? argv.h : argv.help,
    	hash: false,
    	stateOverride: false,
    	strictMode: false,
    	testsEnabled: true, // are we running linter tests
        testENV: false, // are we running unit tests
    	toggleBlock: false,
    	watch: argv.w ? argv.w : argv.watch,
    	version: argv.v ? argv.v : argv.v
    },
    warnings: []
});


/**
 * @description i hold the functionality
 * @return {Object} [i expose the modules to the entire app, so we only do it once]
 */
var coreMethods = stampit().methods({
     parseFiles: function( path ) {
        var app = this;

        glob(path, {}, function( err, files ) {
            if ( err ) { throw err; }
            var len = files.length - 1;

            // console.log( methods.__proto__ );

            files.forEach(function( file, i ) {
                return app.parse( app, file, len, i );
            });
        });
    },
    setConfig: function( conf ) {
        var newConfig = fs.readFileSync( process.cwd() + '/' + conf );
        return JSON.parse( newConfig );
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
    blockStyleCorrect: blockStyleCorrect,
    brackets: brackets,
    checkBorderNone: checkBorderNone,
    colon: colon,
    commaStyleCorrect: commaStyleCorrect,
    commentStyleCorrect: commentStyleCorrect,
    cssLiteral: cssLiteral,
    efficient: efficient,
    extendStyleCorrect: extendStyleCorrect,
    hasComment: hasComment,
    hashEnding: hashEnding,
    hashStarting: hashStarting,
    leadingZero: leadingZero,
    mixedSpacesAndTabs: mixedSpacesAndTabs,
    namingConvention: namingConvention,
    parenStyleCorrect: parenStyleCorrect,
    placeholderStyleCorrect: placeholderStyleCorrect,
    semicolon: semicolon,
    startsWithComment: startsWithComment,
    tooMuchNest: tooMuchNest,
    universalSelector: universalSelector,
    whitespace: whitespace,
    validProperty: validProperty,
    validValue: validValue,
    varStyleCorrect: varStyleCorrect,
    zeroUnits: zeroUnits,
    zIndexr: zIndexr,
    validCSS: validCSS,
    validHTML: validHTML
});


/**
 * @description i initialize everything
 * @return {Function} [calls the part of the app we want, depending on state]
 */
var init = stampit().enclose(function () {
    // if path/ passed in use that for the dir
    if ( process.argv[2] && this.flags.indexOf( process.argv[2] ) === -1 ) {
        this.state.dir = process.argv[2];
    }

	// display help message if user types --help
	if ( this.state.help ) {
		return this.help();
	}

	// output version # from package.json
	if ( this.state.version ) {
		return this.ver( this );
	}

    // turn on strict if strict flag passed
	if ( argv.s || argv.strict ) {
	    this.state.strictMode = true;
	}

	// if -c or --config flags used
	if ( argv.c || argv.config) {
        this.state.config = argv.c ? argv.c : argv.config;
        this.config = this.setConfig( this.state.config );
	}

    // fire watch or read based on flag
    if ( this.state.watch ) {
        return this.watch( this, this.state.dir );
    }
    else {
        return this.read( this, this.state.dir );
    }
});


// let there be light ( * )
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