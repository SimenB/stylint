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
 *       x 3. check for space after comment @DONE
 *       x 4. check for 0px @DONE
 *       - 5. check for tab depth (partially implemented, needs bulletproofing)
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
 *       x 15. toggleable via @stylint comments
 */


// modules
const fs    	= require('fs'), 			// base node file system module
      chalk 	= require('chalk'), 		// colorize outputs
      symbols 	= require('log-symbols'),	// pretty symbols for output
      lazy  	= require('lazy.js'), 		// utility belt
      argv    	= require('yargs').argv,	// cli cli cli
      glob 		= require('glob').Glob,		// oh my (file) glob
      chokidar 	= require('chokidar');		// better file watching than fs.watch


// tests
const colon					= require('./lib/checkForColon'),
	  semicolon				= require('./lib/checkForSemicolon'),
	  commentStyleCorrect 	= require('./lib/checkCommentStyle'),
	  pxStyleCorrect		= require('./lib/checkForPx'),
	  universalSelector		= require('./lib/checkForUniversal'),
	  tooMuchNest			= require('./lib/checkNesting'),
	  notEfficient			= require('./lib/checkForEfficiency');
	  // spaces				= require('./lib/checkSpaces'),
	  // tabs					= require('./lib/checkTabs');


// display help message if user types --help
if (argv.help) {
	console.log(chalk.green('\nStylint v.0.0.1'));
	console.log('Usage: stylint [dir | file] [options]\n');
	console.log('Options:');
	console.log('--help', '		Display list of commands');
	console.log('--watch', '	Watch file or directory and run lint on change');
	console.log('--all', '		Use with --watch. Tells stylint to lint entire dir on change instead of curr file');
	console.log('--config', '	Pass in location of custom config file');
	console.log('--strict', '	Run all tests, allow no warnings or errors\n');
}


// module for our functionality
var Lint = (function() {
	var enabled = true,
		warnings = [],
		config = {
			'alphabeticalOrder': false,
			'colons': true,
			'comments': true,
			'depth': true,
			'depthLimit': 4,
			'duplicateProperties': false,
			'efficient': true,
			'indent': 4,
			'maxWarnings': 10,
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
			var i = 0,
				len;

			/**
			 * if nothing passed in, default to linting the curr dir.
			 * stuffToLint will be an object of files in this case
			 */
			if (typeof lintMe === 'object') {
				len = lintMe.length - 1;

				lazy(lintMe).each(function(file) {
					i++;
					return Lint.parse(file, len, i);
				});
			}
			/**
			 * else we'll have either a filename or dir name to work with
			 * if directory we use the glob logic to return an array of files to test
			 */
			else {
				fs.stat(lintMe, function(err, stats) {
					if (err) { return; }

					if (stats.isFile()) {
						return Lint.parse(lintMe, 0, 1);
					}
					else if (stats.isDirectory()) {
						glob(lintMe + '**/*.styl', {}, function(err, files) {
							if (err) { throw err; }
							len = files.length - 1;

							// iterate over every file
							lazy(files).each(function(file) {
								i++;
								return Lint.parse(file, len, i);
							});
						});
					}
				});
			}
		},


		/**
		 * pass in file and parse it with lazy
		 * @param  {string} file     the file to read
		 * @param  {number} len      the total amount of files we readin'
		 * @param  {number} currFile the file number we're currently on
		 * @return {function}        output results when we're done
		 */
		parse: function(file, len, currFile) {
			var lineNum = 0;

			// read file line by line and run tests
			lazy.strict()
				.readFile(file)
			 	.lines()
			 	.each(function(line) {
			 		var output = line.trim();
			 		lineNum += 1;
			 		// run our tests on the line
			 		return Lint.test(line, lineNum, output);
				})
				.onComplete(function() {
					// are we done yet? only output warnings and errors when on the last file
					if (currFile > len) {
						return Lint.done();
					}
				});
		},


		/**
		 * run test if property set to true in config object
		 * @param  {string} line   [line of stylus to test]
		 * @param  {number} num    [the line number]
		 * @param  {string} output [trimmed version of string to output to terminal]
		 * @return void
		 */
		test: function(line, num, output) {
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

			// check for space after // comment (//comment is invalid)
			if (enabled === true && config.comments === true && commentStyleCorrect(line) === false) {
				warnings.push('Space after comment is preferred:\nLine: ' +  num+ ': ' + output);
			}

			// check for 0px (margin 0 is preferred over margin 0px)
			if (enabled === true && config.unecessaryPX === true && pxStyleCorrect(line) === false) {
				warnings.push('0 is preferred over 0px.\nLine: ' + num + ': ' + output);
			}

			// check for * selector (* is discouraged)
			if (enabled === true && config.universal === true && universalSelector(line) === true) {
				warnings.push('* selector is slow. Consider a different selector.\nLine: ' + num + ': ' + output);
			}

			// check for unecessary : (margin 0 is preferred over margin: 0)
			if (enabled === true && config.colons === true && colon(line) === true) {
				warnings.push('Unecessary colon found:\nLine: ' + num + ': ' + output);
			}

			// check for unecessary ; (margin 0; is invalid)
			if (enabled === true && config.semicolons === true && semicolon(line) === true) {
				warnings.push('Unecessary semicolon found:\nLine: ' + num + ': ' + output);
			}

			// check for places where we can be more efficient (margin 0 50px vs margin 0 50px 0 50px)
			if (enabled === true && config.efficient === true && notEfficient(line) === true) {
				warnings.push('The properties on this line could be more succinct:\nLine: ' + num + ': ' + output);
			}

			// check selector depth
			if (enabled === true && config.depth === true) {
				// if you're a bad person and you set tabs and spaces to both be true, default to tabs
				if (config.tabs === true && config.spaces === true) {
					if (tooMuchNest(line, config.depthLimit, 'tabs', config.indent) === true) {
						warnings.push('Selector depth greater than 4:\nLine: ' + num + ': ' + output);
					}
				}
				else {
					// else check tabs against tabs and spaces against spaces
					if (config.tabs === true && tooMuchNest(line, config.depthLimit, 'tabs', config.indent) === true) {
						warnings.push('Selector depth greater than 4:\nLine: ' + num + ': ' + output);
					}
					else if (config.spaces === true && tooMuchNest(line, config.depthLimit, 'spaces', config.indent) === true) {
						warnings.push('Selector depth greater than 4:\nLine: ' + num + ': ' + output);
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
			if (!process.argv[2] || argv.all) {
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
				console.log('Linting: ', path);
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
			// all warnings
			for (var i = 0; i < warnings.length; i++) {
			    console.log( chalk.yellow('Warning: ' + warnings[i]) + '\n' );
			}

			// if you pass strict it displays a slightly more annoying message (that'll show em!)
			if (argv.strict && warnings.length > 0) {
				console.log(symbols.warning, ' ' + chalk.underline.red('Stylint: ' + warnings.length + ' warnings. Strict mode is on: no warnings allowed.'));
			}

			// if you set a max it displays a slightly more annoying message (that'll show em!)
			if (warnings.length > config.maxWarnings) {
				if (warnings.length > config.maxWarnings) {
					console.log(symbols.warning, ' ' + chalk.underline.red('Stylint: ' + warnings.length + ' warnings. Max is set to: ' + config.maxWarnings + '\n'));
				}
			}
			else if (warnings.length === 0) {
				console.log('\n' + symbols.success, ' ' + chalk.green('Stylint: You\'re all clear!\n'));
			}
			else {
			    console.log(symbols.warning, ' ' + chalk.yellow(' ' + warnings.length + ' Warnings\n'));
			}
		}
	};
}());


// if --watch flag passed, set up file watcher
if (argv.watch) {
	Lint.watch();
}


// if --config flag passed, use that instead
if (argv.config) {
	Lint.config(argv.config);
}


// kickoff linter, default to linting curr dir if no file or dir passed
if (!argv.help) {
	if (!process.argv[2]) {
		glob('**/*.styl', {}, function(err, files) {
			if (err) { return; }
			Lint.read(files);
		});
	}
	// else lint what was passed
	else {
		Lint.read(process.argv[2]);
	}
}
