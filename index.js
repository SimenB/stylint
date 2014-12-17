#!/usr/bin/env node

/**
 * Stylus Lint (splinter) (the p is silent)
 * @description A basic, configurable, node based, stylus linter cli
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
 *       --- 7. check for spaces vs tabs (error out if using spaces, or tabs, depending on config) @NOT DONE
 *       x 8. check for 0 0 0 0 or 50px 50px 50px type mistakes @pretty solid it seems?
 *       --- 9. check for alphabetical order @NOT DONE
 *       --- 10. check for duplicates @NOT DONE
 *       --- 11. check for valid css attributes / properties @NOT DONE
 *       x 11. make configurable via .json @DONE
 *       x 12. accept cli flags @DONE
 *       - 13. general code cleanup
 *       --- 14. write tests
 *       x 15. toggleable via @stylint comments @DONE
 *       x 16. check that @block is used when declaring blocks @DONE
 *       x 17. check that $ is used when declaring variables @DONE
 *       x 18. dont trigger colon warnings when inside a hash @DONE
 *       x 19. check that extend(s) is used consistently @DONE
 *       x 20. check that extends use placeholders only @DONE
 */

'use strict';

// modules
var fs    		= require('fs'), 				// base node file system module
	chalk 		= require('chalk'), 			// colorize outputs
	argv    	= require('yargs').argv,		// cli cli cli
	glob 		= require('glob').Glob,			// oh my (file) glob
	chokidar 	= require('chokidar');			// better file watching than fs.watch
	// stream 		= require('stream'),		// read and transform the files
	// liner 		= new stream.Transform( {objectMode: true } ); // needed to read line by line instead of by chunk


// tests
var colon					= require('./lib/checkForColon'),
	semicolon				= require('./lib/checkForSemicolon'),
	pxStyleCorrect			= require('./lib/checkForPx'),
	universalSelector		= require('./lib/checkForUniversal'),
	tooMuchNest				= require('./lib/checkNesting'),
	notEfficient			= require('./lib/checkForEfficiency'),
	commentStyleCorrect 	= require('./lib/checkCommentStyle'),
	varStyleCorrect			= require('./lib/checkVarStyle'),
	blockStyleCorrect		= require('./lib/checkBlockStyle'),
	hashStarting 			= require('./lib/checkForHashStart'),
	extendStyleCorrect 		= require('./lib/checkForExtendStyle'),
	placeholderStyleCorrect = require('./lib/checkForPlaceholderStyle'),
	mixinStyleCorrect		= require('./lib/checkForMixinStyle'),
	checkBorderNone			= require('./lib/checkBorderNone'),
	commaStyleCorrect		= require('./lib/checkCommaStyle'),
	hashEnding				= require('./lib/checkForHashEnd');
	  // spaces				= require('./lib/checkSpaces'),
	  // tabs					= require('./lib/checkTabs');


// display help message if user types --help
if ( argv.help || argv.h ) {
	console.log( chalk.blue('\nStylint') );
	console.log( 'Usage: stylint [dir | file] [options]\n' );
	console.log( 'Options:');
	console.log( '-h', '--help', '	Display list of commands' );
	console.log( '-w', '--watch', '	Watch file or directory and run lint on change' );
	console.log( '-a', '--all', '	Use with --watch. Tells stylint to lint entire dir on change' );
	console.log( '-c', '--config', '	Pass in location of custom config file' );
	console.log( '-s', '--strict', '	Run all tests, allow no warnings or errors' );
	console.log( '-v', '--version', '	Get current version\n' );
	process.exit();
}


// module for our functionality
var Lint = (function() {
	'use strict';
	var enabled = true,
		areWeInAHash = false,
		warnings = [],
		config = {
			'alphabeticalOrder': false,
			'borderNone': true,
			'colons': true,
			'commaSpace': true,
			'comments': true,
			'depth': true,
			'depthLimit': 4,
			'duplicateProperties': false,
			'efficient': true,
			'enforceVarStyle': true,
			'enforceBlockStyle': true,
			'extendPref': 'extends',
			'extraSpace': true,
			'indent': 4,
			'maxWarnings': 10,
			'placeholders': true,
			'unecessaryPX': true,
			'unit': 'px',
		    'semicolons': true,
		    'spaces': false,
		    'tabs': true,
		    'universal': true,
		    'valid': false
		};

	return {
		/**
		 * sets config to use passed in file
		 * this is kinda weird right? i should do this differently
		 */
		config: function() {
			config = JSON.parse( fs.readFileSync(argv.config) );
		},


		/**
		 * check if second argument passed is a file or directory
		 * if file just run tests on it directly, if dir walk through it and run tests on each file
		 * @param [dynamic] could be a filename, dirname, or object of files to iterate
		 * @returns void
		 */
		read: function(lintMe) {
			var len;

			/**
			 * if nothing passed in, default to linting the curr dir.
			 * stuffToLint will be an object of files in this case
			 */
			if (typeof lintMe === 'object') {
				len = lintMe.length - 1;

				lintMe.forEach(function(file, i) {
					return Lint.parse(file, len, i);
				});
			}
			/**
			 * else we'll have either a filename or dir name to work with
			 * if directory we use the glob logic to return an array of files to test
			 */
			else {
				fs.stat(lintMe, function(err, stats) {
					if (err) { throw err; }

					if (stats.isFile()) {
						return Lint.parse(lintMe, 1, 1);
					}
					else if (stats.isDirectory()) {
						glob(lintMe + '**/*.styl', {}, function(err, files) {
							if (err) { throw err; }
							var len = files.length - 1;

							files.forEach(function(file, i) {
								return Lint.parse(file, len, i);
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
				fileContent = fs.readFileSync(file, 'utf8'),
				cleanFile = fileContent.replace(stripComments, function(match) {
					var lines = match.split(/\r\n|\r|\n/),
						lineLen = lines.length - 1,
						output = ' ';

					if (lineLen === 1) {
						return ' ';
					}
					else {
						while (lineLen--) {
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
				return Lint.test(line, i, output, file);
			});

			// if at the last file, call the done function to output results
			if (currFile === len) {
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
		test: function(line, num, output, file) {
			var hasComment = /(\/\/)/,
				startWithLineComment = /(^\/\/)/;

			// the only valid use of brackets is in a hash
			if (hashStarting(line) === true) {
				areWeInAHash = true;
			}

			if (areWeInAHash === true) {
				if (hashEnding(line) === true) {
					areWeInAHash = false;
				}
			}

			// check for @stylint off comments
			if (hasComment.test(line)) {
				/**
				 * first two tests determine if the rest of the tests should run
				 * if @stylint: off comment found, disable tests until @stylint: on comment found
				 */
				if (line.indexOf('@stylint off') !== -1) {
				    enabled = false;
				    return;
				}

				if (line.indexOf('@stylint on') !== -1) {
				    enabled = true;
				}
			}

			// are we running any tests at all?
			if ( enabled ) {
				// check for comment style (//dont do this. // do this)
				if ( hasComment.test(line) ) {
					if ( config.comments === true && commentStyleCorrect(line) === false ) {
						warnings.push(chalk.yellow('line comments require a space after //') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}
				}

				// does the line start with a comment? dont run the following tests
				if ( !startWithLineComment.test(line) ) {
					// does the line have a comment after the stylus? trim it before we run tests
					if ( hasComment.test(line) ) {
						line = line.slice(0, line.indexOf('//') - 1);
					}

					// check that commas are followed by a space
					if ( config.commaSpace === true && commaStyleCorrect(line) === false ) {
						warnings.push(chalk.yellow('commas must be followed by a space for readability') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// check for extra spaces when defining or using a mixin
					if ( config.extraSpace === true && mixinStyleCorrect(line) === false ) {
						warnings.push(chalk.yellow('mixin( $param1, $param2 ) is preferred over mixin($param1, $param2)') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// check for border none (prefer border 0)
					if ( config.borderNone === true && checkBorderNone(line) === true ) {
						warnings.push(chalk.yellow('border 0 is preferred over border none') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// check for @block when defining block var
					if ( config.enforceBlockStyle === true && blockStyleCorrect(line) === false ) {
						warnings.push(chalk.yellow('block variables must include @block') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// check for @extend(s) preference
					if ( config.extendPref !== false && extendStyleCorrect(line, config.extendPref) === false ) {
						warnings.push(chalk.yellow('please use the @' + config.extendPref + ' syntax when extending') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// only extend placeholder vars (or not)
					if ( config.placeholders === true && placeholderStyleCorrect(line) === false ) {
						warnings.push(chalk.yellow('please extend only placeholder vars') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// check for $ at start of var
					if ( config.enforceVarStyle === true && varStyleCorrect(line) === false ) {
						warnings.push(chalk.yellow('variables must be prefixed with the $ sign.') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// check for 0px (margin 0 is preferred over margin 0px)
					if ( config.unecessaryPX === true && pxStyleCorrect(line) === false ) {
						warnings.push(chalk.yellow('0 is preferred over 0px.') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// check for * selector (* is discouraged)
					if ( config.universal === true && universalSelector(line) === true ) {
						warnings.push(chalk.yellow('* selector is slow. Consider a different selector.') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// check for unecessary : (margin 0 is preferred over margin: 0)
					if ( config.colons === true && colon(line, areWeInAHash) ) {
						warnings.push(chalk.yellow('unecessary colon found:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// check for unecessary ; (margin 0; is invalid)
					if ( config.semicolons === true && semicolon(line) === true ) {
						warnings.push(chalk.yellow('unecessary semicolon found:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// check for places where we can be more efficient (margin 0 50px vs margin 0 50px 0 50px)
					if ( config.efficient === true && notEfficient(line) === true ) {
						warnings.push(chalk.yellow('the properties on this line could be more succinct:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
					}

					// check selector depth
					if ( config.depth === true ) {
						// if you're a bad person and you set tabs and spaces to both be true, default to tabs
						if ( config.tabs === true && config.spaces === true ) {
							if ( tooMuchNest(line, config.depthLimit, 'tabs', config.indent) === true ) {
								warnings.push(chalk.yellow('selector depth greater than', config.indent, ':') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
							}
						}
						else {
							// else check tabs against tabs and spaces against spaces
							if ( config.tabs === true 
								&& tooMuchNest(line, config.depthLimit, 'tabs', config.indent ) === true) {
								warnings.push(chalk.yellow('selector depth greater than', config.indent, ':') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
							}
							else if ( config.spaces === true 
								&& tooMuchNest(line, config.depthLimit, 'spaces', config.indent) === true ) {
								warnings.push(chalk.yellow('selector depth greater than', config.indent, ':') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output);
							}
						}
					}
				}
			}
		},


		/**
		 * watch for changes to a file or dir using chokidar, if change, run tests
		 * @return void
		 */
		watch: function() {
			var watcher;

			/**
			 * default to linting the current dir if nothing passed.
			 * if file or dir was passed, check if all flag was passed. if true, lint whole dir anyway
			 */
			if (!process.argv[2] || argv.all || argv.a) {
				watcher = chokidar.watch('**/*.styl', {ignored: /[\/\\]\./, persistent: true});
			}
			// else just lint what was passed
			else {
				watcher = chokidar.watch(process.argv[2], {ignored: /[\/\\]\./, persistent: true});
			}

			// initial watch msg (watching: dir or file)
			watcher.on('ready', function() {
				console.log('Watching: ', process.argv[2], ' for changes.');
			});

			// listen for changes, do somethin
			watcher.on('change', function(path) {
				warnings = [];

				console.log('Linting: ', path, '\n');
				// this is really just to give people time to read the watch msg
				setTimeout(function() {
					Lint.read(path);
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

			warnings.forEach(function( warning, i ) {
				console.log( chalk.yellow('Warning: '), warning, '\n' );
			});

			// if you set a max it displays a slightly more annoying message (that'll show em!)
			if ( len > config.maxWarnings ) {
				console.log( '\uD83D\uDCA9', chalk.underline.red('Stylint: ' + warnings.length + ' warnings. Max is set to: ' + config.maxWarnings + '\n') );
			}
			else if (len === 0) {
				console.log( '\uD83D\uDC4D', chalk.blue('Stylint: You\'re all clear!\n') );
			}
			else {
			    console.log( '\uD83D\uDCA9', chalk.yellow(' ' + warnings.length + ' Warnings\n') );
			}
		}
	};
}());


// if --watch flag passed, set up file watcher
if ( argv.watch || argv.w ) {
	Lint.watch();
}


// if --config flag passed, use that instead
if ( argv.config || argv.c ) {
	if ( argv.config ) {
		Lint.config( argv.config );
	}
	else {
		Lint.config( argv.c );
	}
}

// output version # from package.json
if ( argv.version || argv.v ) {
	console.log( chalk.blue('\nStylint version: '), JSON.parse( fs.readFileSync('package.json') ).version, '\n' );
	process.exit();
}

// kickoff linter, default to linting curr dir if no file or dir passed
// nothing passed in
if ( !process.argv[2] ) {
	glob('**/*.styl', {}, function( err, files ) {
		if ( err ) { throw err; }
		Lint.read( files );
	});
}
// else lint what was passed
else {
	Lint.read( process.argv[2] );
}
