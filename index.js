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
	stampit = require('stampit');


/**
 * @description i hold the functionality
 * @return {Object} [i expose all of our modules to the entire app]
 */
var state = stampit().state({
	config: {
        'borderNone': true, // check for use of border none and recommend border 0
        'brackets': false, // check for { or }, unless used in a hash
        'colons': false, // check for unecessary colons
        'commaSpace': true, // check for spaces after commas (0, 0, 0, .18)
        'commentSpace': false, // check for space after line comment
        'cssLiteral': false, // if true disallow css literals
        'depthLimit': 5, // set a maximum selector depth (dont nest more than 4 deep)
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
    	config: argv.c ? argv.c : argv.config,
    	cssBlock: false,
    	dir: process.cwd(),
    	done: false,
    	help: argv.h ? argv.h : argv.help,
    	hash: false,
    	stateOverride: false,
    	strictMode: false,
    	testsEnabled: true,
    	toggleBlock: false,
    	watch: argv.w ? argv.w : argv.watch,
    	version: argv.v ? argv.v : argv.v
    },
    warnings: []
});


/**
 * @description i hold the npm
 * @return {Object} [i expose the modules to the entire app, so we only need to get them once]
 */
var npmMethods = stampit().enclose(function () {
    return stampit.extend(this, {
        fs: require('fs'),
        chalk: require('chalk'),
        glob: require('glob').Glob,
    });
});


/**
 * @description i hold the functionality
 * @return {Object} [i expose the modules to the entire app, so we only do it once]
 */
var coreMethods = stampit().enclose(function () {
	return stampit.extend(this, {
        done: require('./src/done'),
        help: require('./src/help'),
        read: require('./src/read'),
        parse: require('./src/parse'),
        test: require('./src/test'),
        watch: require('./src/watch'),
        ver: require('./src/version')
	});
});


/**
 * @description i hold the tests (not the unit test, the other tests)
 * @return {Object} [i expose the to the entire app]
 */
var testMethods = stampit().enclose(function () {
    return stampit.extend(this, {
        blockStyleCorrect       : require('./src/checks/checkBlockStyle'),
        brackets                : require('./src/checks/checkForBrackets'),
        checkBorderNone         : require('./src/checks/checkBorderNone'),
        colon                   : require('./src/checks/checkForColon'),
        commaStyleCorrect       : require('./src/checks/checkCommaStyle'),
        commentStyleCorrect     : require('./src/checks/checkCommentStyle'),
        cssLiteral              : require('./src/checks/checkForCssLiteral'),
        efficient               : require('./src/checks/checkForEfficiency'),
        extendStyleCorrect      : require('./src/checks/checkForExtendStyle'),
        hasComment              : require('./src/checks/checkForComment'),
        hashEnding              : require('./src/checks/checkForHashEnd'),
        hashStarting            : require('./src/checks/checkForHashStart'),
        leadingZero             : require('./src/checks/checkForLeadingZero'),
        mixedSpacesAndTabs      : require('./src/checks/checkForMixedSpacesTabs'),
        namingConvention        : require('./src/checks/checkNamingConvention'),
        parenStyleCorrect       : require('./src/checks/checkForParenStyle'),
        placeholderStyleCorrect : require('./src/checks/checkForPlaceholderStyle'),
        semicolon               : require('./src/checks/checkForSemicolon'),
        startsWithComment       : require('./src/checks/checkForCommentStart'),
        tooMuchNest             : require('./src/checks/checkNesting'),
        universalSelector       : require('./src/checks/checkForUniversal'),
        whitespace              : require('./src/checks/checkForTrailingWhitespace'),
        validProperty           : require('./src/checks/checkForValidProperties'),
        validValue              : require('./src/checks/checkForValidValues'),
        varStyleCorrect         : require('./src/checks/checkVarStyle'),
        zeroUnits               : require('./src/checks/checkForZeroUnits'),
        zIndexr                 : require('./src/checks/zIndexr'),
        validCSS                : require('./src/checks/validCSS'),
        validHTML               : require('./src/checks/validHTML')
    });
});


/**
 * @description i initialize everything
 * @return {Function} [calls the part of the app we want, depending on state]
 */
var init = stampit().enclose(function () {
	var app = this; // cause scope

	// kickoff linter, default to linting curr dir if no file or dir passed
	app.kickoff = function() {
		if ( app.state.watch ) {
			return app.watch( app.state.dir );
		}
		else {
			return app.read( app.state.dir );
		}
	}

    // if path/ passed in use that for the dir
    if ( process.argv[2] && app.flags.indexOf( process.argv[2] ) === -1 ) {
        app.state.dir = process.argv[2];
    }

	// display help message if user types --help
	if ( app.state.help ) {
		return app.help();
	}

	// output version # from package.json
	if ( app.state.version ) {
		return app.ver();
	}

	if ( argv.s || argv.strict ) {
	    app.state.strictMode = true;
	}

	// if -c or --config flags used
	if ( app.state.config ) {
	    app.fs.readFile( process.cwd() + '/' + app.state.config, function( err, data ) {
	        if ( err ) { throw err; }
	        app.config = JSON.parse( data );
	        return app.kickoff();
	    });
	}
	// else default kickoff
	else {
		return app.kickoff();
	}
});


// let there be light ( ! )
var Lint = stampit().compose( npmMethods, coreMethods, testMethods, state, init ).create();