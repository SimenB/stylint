#!/usr/bin/env node

/**
 * Stylus Lint (splinter) (the p is silent)
 * @description A basic, configurable, node based, stylus linter cli
 * @flow
 *
 *       just because things are marked done doesn't mean they can't be improved
 *       they're just 'good enough' for now usually
 *
 *       @TODO(s)
 *       x 1. check for semicolons @DONE
 *       x 2. check for colons @DONE
 *       x 3. check for comment style @DONE
 *       x 4. check for 0px @DONE
 *       x 5. check for selector depth @DONE
 *       x 6. check for * selector @DONE
 *       x 7. check for spaces vs tabs @DONE
 *       x 8. check for 0 0 0 0 or 50px 50px 50px type mistakes @pretty solid it seems?
 *       --- 9. check for alphabetical order @NOT DONE
 *       --- 10. check for duplicates @NOT DONE
 *       --- 11. check for valid css attributes / properties @NOT DONE
 *       x 11. make configurable via .json @DONE
 *       x 12. accept cli flags @DONE
 *       - 13. general code cleanup
 *       --- 14. write tests @MOSTLY DONE
 *       x 15. toggleable via @stylint comments @DONE
 *       x 16. check that @block is used when declaring blocks @DONE
 *       x 17. check that $ is used when declaring variables @DONE
 *       x 18. dont trigger colon warnings when inside a hash @DONE
 *       x 19. check that extend(s) is used consistently @DONE
 *       x 20. check that extends use placeholders only @DONE
 */

'use strict';

// modules
var argv    	= require('yargs').argv,		// cli cli cli
	chalk 		= require('chalk'), 			// colorize outputs
	chokidar 	= require('chokidar'),			// better file watching than fs.watch
	fs    		= require('fs'), 				// base node file system module
	getDelay	= require('./lib/delay'),		// monitor event loop
	glob 		= require('glob').Glob;			// oh my (file) glob

	// stream 		= require('stream'),		// read and transform the files
	// liner 		= new stream.Transform( {objectMode: true } ); // needed to read line by line instead of by chunk


// tests
var blockStyleCorrect		= require('./lib/checks/checkBlockStyle'),
	brackets				= require('./lib/checks/checkForBrackets'),
	checkBorderNone			= require('./lib/checks/checkBorderNone'),
	colon					= require('./lib/checks/checkForColon'),
	commaStyleCorrect		= require('./lib/checks/checkCommaStyle'),
	commentStyleCorrect 	= require('./lib/checks/checkCommentStyle'),
	cssLiteral              = require('./lib/checks/checkForCssLiteral'),
	efficient				= require('./lib/checks/checkForEfficiency'),
	extendStyleCorrect 		= require('./lib/checks/checkForExtendStyle'),
	hasComment				= require('./lib/checks/checkForComment'),
	hashEnding				= require('./lib/checks/checkForHashEnd'),
	hashStarting 			= require('./lib/checks/checkForHashStart'),
	leadingZero				= require('./lib/checks/checkForLeadingZero'),
	mixedSpacesAndTabs		= require('./lib/checks/checkForMixedSpacesTabs'),
	parenStyleCorrect		= require('./lib/checks/checkForParenStyle'),
	placeholderStyleCorrect = require('./lib/checks/checkForPlaceholderStyle'),
	semicolon				= require('./lib/checks/checkForSemicolon'),
	startsWithComment		= require('./lib/checks/checkForCommentStart'),
	tooMuchNest				= require('./lib/checks/checkNesting'),
	universalSelector		= require('./lib/checks/checkForUniversal'),
	whitespace				= require('./lib/checks/checkForTrailingWhitespace'),
	varStyleCorrect			= require('./lib/checks/checkVarStyle'),
	zeroUnits				= require('./lib/checks/checkForZeroUnits');


// module for our functionality
// this has gotten a bit unwieldy yeah?
var Lint = (function() {
	var config = setUpConfig(),
		enabled = true,
		cssBlock = false,
		areWeInAHash = false,
		stylintToggleBlock = false,
		warnings = [],
		flags = [
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
		];


	/**
	 * sets config
	 * first checks for config file in curr dir
	 * then checks for passed in config file
	 * then defaults to the hard coded object
	 * @param {string} [flagName] location of passed in config file
	 */
	function setUpConfig() {
		var file, config,
			fallback = {
				'borderNone': true, // check for use of border none and recommend border 0
				'brackets': true, // check for { or }, unless used in a hash
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
				'mixed': true,	// check for mixed spaces and tabs
				'parenSpace': false, // check for extra space inside parens when defining or using mixins
				'placeholders': true, // only allow @extending of placeholder vars
			    'semicolons': false, // check for unecessary semicolons
			    'trailingWhitespace': true, // check for trailing whitespace
			    'universal': true, // check for use of * and recommend against it
			    'zeroUnits': true // check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
			};

		// if custom config file passed in
		if ( argv.config || argv.c ) {
			file = argv.config ? argv.config : argv.c;
			try {
				config = JSON.parse( fs.readFileSync(file) );
			}
			catch ( err ) {
				console.log( err );
			}
		}
		// else no config passed in, so try default dir
		else {
			try {
				config = JSON.parse( fs.readFileSync('./.stylintrc') );
			}
			catch ( err ) {
				console.log( err );
			}
		}

		if ( config ) {
			return config;
		}
		else {
			return fallback;
		}
	}

	return {
		/**
		 * check if second argument passed is a file or directory
		 * if file just run tests on it directly, if dir walk through it and run tests on each file
		 * @param [dynamic] could be a file or dir (string), or object of files to iterate
		 * @returns void
		 */
		read: function( lintMe ) {
			// if nothing passed in, default to linting the curr dir
			if ( flags.indexOf( lintMe ) !== -1 || lintMe === 'nothing' ) {
				glob('**/*.styl', {}, function(err, files) {
					if (err) { throw err; }
					var len = files.length - 1;

					files.forEach(function( file, i ) {
						return Lint.parse( file, len, i );
					});
				});
			}

			/**
			 * else we'll have either a filename or dir name to work with
			 * if directory we use the glob logic to return an array of files to test
			 */
			else {
				fs.stat(lintMe, function( err, stats ) {
					if (err) { throw err; }

					if ( stats.isFile() ) {
						return Lint.parse( lintMe, 1, 1 );
					}
					else if ( stats.isDirectory() ) {
						glob(lintMe + '**/*.styl', {}, function( err, files ) {
							if (err) { throw err; }
							var len = files.length - 1;

							files.forEach(function(file, i) {
								return Lint.parse( file, len, i );
							});
						});
					}
				});
			}
		},


		/**
		 * pass in file and parse it with streams
		 * @param  {string} file     the file to read
		 * @param  {number} len      the total amount of files we readin'
		 * @param  {number} currFile the file number we're currently on
		 * @return {function}        output results when we're done
		 */
		parse: function( file, len, currFile ) {
			var stripComments = /(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)/g,
				fileContent = fs.readFileSync( file, 'utf8' ),
				cleanFile = fileContent.replace(stripComments, function( match ) {
					var lines = match.split(/\r\n|\r|\n/),
						lineLen = lines.length - 1,
						output = ' ';

					if ( lineLen === 1 ) {
						return ' ';
					}
					else {
						while ( lineLen-- ) {
							output += '\n';
						}
						return output;
					}
				}),
				lines = cleanFile.split('\n');

			/**
			 * so, this function trims each line and then tests it
			 * @param  {string} 	the line of stylus to test
			 * @return {function}	run test
			 */
			lines.forEach(function( line, i ) {
				var output = line.trim();
				// line nos don't start at 0
				i++;
				return Lint.test( line, i, output, file );
			});

			// if at the last file, call the done function to output results
			if ( currFile === len ) {
				return Lint.done();
			}
		},


		/**
		 * run test if property set to true in config object
		 * @param  {string} line   		line of stylus to test
		 * @param  {number} num    		the line number
		 * @param  {string} output 		trimmed version of string to output to terminal
		 * @param  {string} file 		curr file being linted
		 * @return void
		 */
		test: function( line, num, output, file ) {
			var strict = false;

			// if strict flag passed, run all tests
			if ( argv.s || argv.strict ) {
				strict = true;
			}

			// check for @stylint off comments
			if ( hasComment(line) ) {
				/**
				 * first two tests determine if the rest of the tests should run
				 * if @stylint: off comment found, disable tests until @stylint: on comment found
				 */
				if ( line.indexOf('@stylint off') !== -1 ) {
					stylintToggleBlock = true;
				    enabled = false;
				    return;
				}

				if ( stylintToggleBlock && line.indexOf('@stylint on') !== -1 ) {
					stylintToggleBlock = false;
				    enabled = true;
				}
			}

			// by default we skip css literals, but if css literal option set to true we throw a warning
			if ( config.cssLiteral === false && line.indexOf('@css') !== -1 ) {
				cssBlock = true;
				return;
			}

			// if we're in a css block, check for the end of it
			if ( cssBlock ) {
				enabled = false;

				// hash ending checks for } as the first character
				if ( hashEnding(line, true) ) {
					cssBlock = false;
					enabled = true;
					return;
				}
			}

			// are we running any tests at all?
			if ( enabled ) {
				// check for comment style (//dont do this. // do this)
				if ( hasComment(line) ) {
					if ( config.commentSpace || strict ) {
						if ( commentStyleCorrect(line) === false ) {
							warnings.push(chalk.yellow('line comments require a space after //') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
						}
					}
				}

				// does the line start with a comment? dont run the following tests
				if ( !startsWithComment(line) ) {

					// does the line have a comment after the stylus? trim it before we run tests
					if ( hasComment(line) ) {
						line = line.slice( 0, line.indexOf('//') - 1 );
					}

					// the only valid use of brackets is in a hash
					if ( hashStarting(line) ) {
						areWeInAHash = true;
						return;
					}

					// if the above equals true we check for the end of the hash
					if ( hashEnding(line, areWeInAHash) ) {
						areWeInAHash = false;
						return;
					}

					// check that commas are followed by a space
					if ( config.cssLiteral || strict ) {
						if ( cssLiteral(line) ) {
							warnings.push(chalk.yellow('refrain from using css literals') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
							return;
						}
					}

					// check for brackets (except in hash)
					if ( config.brackets || strict ) {
						if ( brackets(line, areWeInAHash) && !cssBlock ) {
							warnings.push(chalk.yellow('unecessary bracket') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
						}
					}

					// check that commas are followed by a space
					if ( config.commaSpace || strict ) {
						if ( commaStyleCorrect(line) === false ) {
							warnings.push(chalk.yellow('commas must be followed by a space for readability') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
						}
					}

					// check for extra spaces when using parens
					if ( config.mixinSpace || config.parenSpace || strict ) {
						if ( parenStyleCorrect(line) === false ) {
							warnings.push(chalk.yellow('( $param1, $param2 ) is preferred over ($param1, $param2)') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
						}
					}

					// check for border none (prefer border 0)
					if ( config.borderNone || strict ) {
						if ( checkBorderNone(line) ) {
							warnings.push( chalk.yellow('border 0 is preferred over border none') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// check for border none (prefer border 0)
					if ( config.leadingZero || strict ) {
						if ( leadingZero(line) ) {
							warnings.push( chalk.yellow('leading zeros for decimal points are unecessary') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// check for @block when defining block var
					if ( config.enforceBlockStyle || strict ) {
						if ( blockStyleCorrect(line) === false ) {
							warnings.push( chalk.yellow('block variables must include @block') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// check for @extend(s) preference
					if ( config.extendPref || strict ) {
						if ( extendStyleCorrect(line, config.extendPref) === false ) {
							warnings.push( chalk.yellow('please use the ' + config.extendPref + ' syntax when extending') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// only extend placeholder vars (or not)
					if ( config.placeholders || strict ) {
						if ( placeholderStyleCorrect(line) === false ) {
							warnings.push( chalk.yellow('please extend only placeholder vars') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// check for $ at start of var
					if ( config.enforceVarStyle || strict ) {
						if ( varStyleCorrect(line) === false ) {
							warnings.push( chalk.yellow('variables must be prefixed with the $ sign.') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// check for * selector (* is discouraged)
					if ( config.universal || strict ) {
						if ( universalSelector(line) ) {
							warnings.push( chalk.yellow('* selector is slow. Consider a different selector.') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// check for unecessary : (margin 0 is preferred over margin: 0)
					if ( config.colons || strict ) {
						if ( colon(line, areWeInAHash) ) {
							warnings.push( chalk.yellow('unecessary colon found:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// check for unecessary ; (margin 0; is invalid)
					if ( config.semicolons || strict ) {
						if ( semicolon(line) ) {
							warnings.push( chalk.yellow('unecessary semicolon found:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// check for places where we can be more efficient (margin 0 50px vs margin 0 50px 0 50px)
					if ( config.efficient || strict ) {
						if ( efficient(line) === false ) {
							warnings.push( chalk.yellow('the value on this line could be more succinct:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// check mixed spaces and tabs
					if ( config.mixed || strict ) {
						// else check tabs against tabs and spaces against spaces
						if ( mixedSpacesAndTabs( line, config.indentSpaces ) ) {
							warnings.push( chalk.yellow('mixed spaces and tabs') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}


					// check for trailing whitespace
					if ( config.trailingWhitespace || strict ) {
						// else check tabs against tabs and spaces against spaces
						if ( whitespace( line ) ) {
							warnings.push( chalk.yellow('trailing whitespace') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// check selector depth
					if ( config.depthLimit || strict ) {
						// else check tabs against tabs and spaces against spaces
						if ( tooMuchNest( line, config.depthLimit, config.indentSpaces ) ) {
							warnings.push( chalk.yellow('selector depth greater than', config.depthLimit + ':') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}

					// check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
					if ( config.zeroUnits || config.unecessaryPx || strict ) {
						if ( zeroUnits(line) ) {
							warnings.push( chalk.yellow('0 is preferred. Unit value is unnecessary.') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
						}
					}
				}
			}
		},


		/**
		 * called when --help or -h flags used
		 * @return void
		 */
		help: function() {
			console.log( chalk.blue('\nStylint') );
			console.log( 'Usage: stylint [dir | file] [options]\n' );
			console.log( 'Options:');
			console.log( '-h', '--help', '	Display list of commands' );
			console.log( '-w', '--watch', '	Watch file or directory and run lint on change' );
			console.log( '-c', '--config', '	Pass in location of custom config file' );
			console.log( '-s', '--strict', '	Run all tests, regardless of config' );
			console.log( '-v', '--version', '	Get current version\n' );
		},


		/**
		 * called when --version or -v flags used
		 * @return void
		 */
		version: function() {
			var ver = JSON.parse( fs.readFileSync('package.json') ).version;
			console.log( chalk.blue('\nStylint version: '), ver, '\n' );
			// process.exit();
		},


		/**
		 * watch for changes to a file or dir using chokidar, if change, run tests
		 * @return void
		 */
		watch: function() {
			var watcher,
				currDir = false;

			/**
			 * default to linting the current dir if nothing passed.
			 */
			if ( flags.indexOf( process.argv[2] ) !== -1 ) {
				currDir = true;
				watcher = chokidar.watch('**/*.styl', {
					ignored: /[\/\\]\./,
					persistent: true
				});
			}
			// else just lint what was passed
			else {
				watcher = chokidar.watch(process.argv[2], {
					ignored: /[\/\\]\./,
					persistent: true
				});
			}

			// initial watch msg
			watcher.on('ready', function() {
				// watching: dir or file for changes
				if ( !currDir ) {
					console.log( chalk.blue('Watching: '), process.argv[2], ' for changes.' );
				}
				// watching: **/*.styl for changes.
				else {
					console.log( chalk.blue('Watching: **/*.styl for changes.' ) );
				}
			});

			// listen for changes, do somethin
			watcher.on('change', function(path) {
				warnings = [];

				console.log( chalk.blue('Linting: '), path, '\n' );
				// this is really just to give people time to read the watch msg
				setTimeout(function() {
					Lint.read( path );
				}, 350);
			});
		},


		/**
		 * display all warnings, errors, and line nos where they occur
		 * display total number of both. if over the set limit, display a uh, slightly more stern message i guess
		 * @return void
		 */
		done: function() {
			var len = warnings.length;

			warnings.forEach(function( warning ) {
				console.log( chalk.yellow('Warning: '), warning, '\n' );
			});

			// if you set a max it displays a slightly more annoying message (that'll show em!)
			if ( len > config.maxWarnings ) {
				console.log( '\uD83D\uDCA9 ', chalk.underline.red('Stylint: ' + warnings.length + ' warnings. Max is set to: ' + config.maxWarnings + '\n') );
			}
			else if (len === 0) {
				console.log( '\n \uD83D\uDC4D ', chalk.blue('Stylint: You\'re all clear!\n') );
			}
			else {
			    console.log( '\uD83D\uDCA9 ', chalk.yellow(warnings.length + ' Warnings\n') );
			}
		}
	};
}());

// display help message if user types --help
if ( argv.help || argv.h ) {
	Lint.help();
}

// if --watch flag passed, set up file watcher
if ( argv.watch || argv.w ) {
	Lint.watch();
}

// output version # from package.json
if ( argv.version || argv.v ) {
	Lint.version();
}

// kickoff linter, default to linting curr dir if no file or dir passed
// nothing passed in
if ( !process.argv[2] ) {
	Lint.read( 'nothing' );
}
// else lint what was passed
else {
	Lint.read( process.argv[2] );
}


// get event loop delays in ms
// getDelay();