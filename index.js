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
    alphabetCheck           = require('./src/checks/alphabetCheck'),
    blockStyleCorrect       = require('./src/checks/checkBlockStyle'),
    brackets                = require('./src/checks/checkForBrackets'),
    checkBorderNone         = require('./src/checks/checkBorderNone'),
    colon                   = require('./src/checks/checkForColon'),
    commaStyleCorrect       = require('./src/checks/checkCommaStyle'),
    commentStyleCorrect     = require('./src/checks/checkCommentStyle'),
    cssLiteral              = require('./src/checks/checkForCssLiteral'),
    deDupeZ                 = require('./src/checks/zIndexDeDupe'),
    efficient               = require('./src/checks/checkForEfficiency'),
    extendStyleCorrect      = require('./src/checks/checkForExtendStyle'),
    hasComment              = require('./src/checks/checkForComment'),
    hashEnding              = require('./src/checks/checkForHashEnd'),
    hashStarting            = require('./src/checks/checkForHashStart'),
    leadingZero             = require('./src/checks/checkForLeadingZero'),
    mixedSpacesAndTabs      = require('./src/checks/checkForMixedSpacesTabs'),
    namingConvention        = require('./src/checks/checkNamingConvention'),
    normalizeZ              = require('./src/checks/zIndexNormalize'),
    parenStyleCorrect       = require('./src/checks/checkForParenStyle'),
    placeholderStyleCorrect = require('./src/checks/checkForPlaceholderStyle'),
    semicolon               = require('./src/checks/checkForSemicolon'),
    startsWithComment       = require('./src/checks/checkForCommentStart'),
    tooMuchNest             = require('./src/checks/checkNesting'),
    universalSelector       = require('./src/checks/checkForUniversal'),
    validProperty           = require('./src/checks/checkForValidProperties'),
    varStyleCorrect         = require('./src/checks/checkVarStyle'),
    whitespace              = require('./src/checks/checkForTrailingWhitespace'),
    zeroUnits               = require('./src/checks/checkForZeroUnits');


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
        'valid': true, // check if prop or value is a valid assignment
        'zeroUnits': true, // check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
        'zIndexDuplicates': true, // just find duplicate z index values
        'zIndexNormalize': 5 // suggest a normalized z index value, base of whatever this is
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
    zCache: []
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
                return app.parseFile( app, file, len, i );
            });
        });
    },
    setConfig: function( path ) {
        return JSON.parse( fs.readFileSync( process.cwd() + '/' + path ) );
    },
    done: done,
    help: help,
    read: read,
    parseFile: parse,
    test: test,
    ver: ver,
    watch: watch
});


var testMethods = stampit().methods({
    alphabetCheck: alphabetCheck,
    blockStyleCorrect: blockStyleCorrect,
    brackets: brackets,
    checkBorderNone: checkBorderNone,
    colon: colon,
    commaStyleCorrect: commaStyleCorrect,
    commentStyleCorrect: commentStyleCorrect,
    cssLiteral: cssLiteral,
    deDupeZ: deDupeZ,
    efficient: efficient,
    extendStyleCorrect: extendStyleCorrect,
    hasComment: hasComment,
    hashEnding: hashEnding,
    hashStarting: hashStarting,
    leadingZero: leadingZero,
    mixedSpacesAndTabs: mixedSpacesAndTabs,
    namingConvention: namingConvention,
    normalizeZ: normalizeZ,
    parenStyleCorrect: parenStyleCorrect,
    placeholderStyleCorrect: placeholderStyleCorrect,
    semicolon: semicolon,
    startsWithComment: startsWithComment,
    tooMuchNest: tooMuchNest,
    universalSelector: universalSelector,
    validProperty: validProperty,
    varStyleCorrect: varStyleCorrect,
    whitespace: whitespace,
    zeroUnits: zeroUnits
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
		return this.ver( this );
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