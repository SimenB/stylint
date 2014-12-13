#!/usr/bin/env node

/**
 * Stylus Lint (splinter) (the p is silent)
 * @description A basic, configurable, node based, stylus linter cli
 * @todo everything, basically, mostly as follows:
 *       1. check for semicolons @DONE
 *       2. check for colons @DONE
 *       3. check for space after comment @DONE
 *       4. check for 0px @DONE
 *       5. check for tab depth (partially implemented, needs bulletproofing)
 *       6. check for * selector @DONE
 *       7. check for spaces vs tabs (error out if using spaces, or tabs, depending on config) @NOT DONE
 *       8. check for 0 0 0 0 or 50px 50px 50px type mistakes @NOT DONE
 *       9. check for alphabetical order @NOT DONE
 *       10. check for duplicate selectors @NOT DONE
 *       11. check for valid properties @NOT DONE
 *       11. make configurable via .json @DONE
 *       12. accept cli flags @DONE
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
const colon					= require('./tests/checkForColon'),
	  semicolon				= require('./tests/checkForSemicolon'),
	  commentStyleCorrect 	= require('./tests/checkCommentStyle'),
	  pxStyleCorrect		= require('./tests/checkForPx'),
	  universalSelector		= require('./tests/checkForUniversal'),
	  tooMuchNest			= require('./tests/checkNesting'),
	  efficient				= require('./tests/checkForEfficiency'),
	  spaces				= require('./tests/checkSpaces'),
	  tabs					= require('./tests/checkTabs');


// pretty duh
var config,
	warnings = [],
	watcher;


// set up config (if no config file passed in use default config)
if (!argv.config) {
	// first look for config in curr dir
	config = JSON.parse( fs.readFileSync('./.styluslintrc') );
}
// if you passed in a config using --config then we use that instead
else {
	config = JSON.parse( fs.readFileSync(argv.config) );
}


// display help message if user types --help
if (argv.help) {
	console.log(chalk.green('\nStylint v.0.0.1'));
	console.log('Usage: stylint [dir | file] [options]\n');
	console.log('Options:');
	console.log('--help', 'Display list of commands');
	console.log('--watch', 'Watch file or directory and run lint on change');
	console.log('--config', 'Pass in location of custom config file');
	console.log('--strict', 'Run all tests, allow no warnings or errors\n');
}

// default to linting the current dir
if (!process.argv[2]) {
	glob('**/*.styl', {}, function(err, files) {
		if (err) { return; }
		lint(files);

		if (argv.watch) {
			watcher = chokidar.watch('**/*.styl', {ignored: /[\/\\]\./, persistent: true});
		}
	});
}
// else lint what was passed
else {
	lint(process.argv[2]);

	if (argv.watch) {
		watcher = chokidar.watch(process.argv[2], {ignored: /[\/\\]\./, persistent: true});
	}
}


// file watcher setup
if (argv.watch) {
	watcher.on('ready', function(path, stats) {
		console.log('Watching: ', process.argv[2], ' for changes.');
	});
	watcher.on('change', function(path, stats) {
		warnings = [];

		console.log('Linting: ', path);

		// this is really just to give people time to read the msg
		setTimeout(function() {lint(path);}, 350);
	});
}

/**
 * check if second argument passed is a file or directory
 * if file just run tests on it directly, if dir walk through it and run tests on each file
 * @param {error} [err] [if err kill it]
 * @param the stat object for process.argv[2]
 * @returns void
 */
function lint(stuffToLint) {
	var i = 0;
	/**
	 * if nothing passed in, default to linting the curr dir.
	 * stuffWeBeCheckin will be an object of files in this case
	 * @type {[type]}
	 */
	if (typeof stuffToLint === 'object') {

		lazy(stuffToLint).each(function(file) {
			var len = stuffToLint.length - 1;
			i++;
			return lazyParse(file, len, i);
		});
	}
	/**
	 * else we'll have either a filename or dir name to work with
	 * if directory we use the walk logic to return an array of files to test
	 */
	else {
		fs.stat(stuffToLint, function(err, stats) {
			if (err) { return; }

			if (stats.isFile()) {
				return lazyParse(stuffToLint, 0, 1);
			}
			else if (stats.isDirectory()) {
				glob(stuffToLint + '**/*.styl', {}, function(err, files) {
					if (err) { throw err; }
					var len = files.length - 1;

					// iterate over every file
					lazy(files).each(function(file) {
						i++;
						return lazyParse(file, len, i);
					});
				});
			}
		});
	}
}


/**
 * pass in file and parse it with lazy
 * @param  {string} file     the file to read
 * @param  {number} len      the total amount of files we readin'
 * @param  {number} currFile the file number we're currently on
 * @return {function}        output results when we're done
 */
function lazyParse(file, len, currFile) {
	var lineNum = 0;

	// read file line by line and run tests
	lazy.strict()
		.readFile(file)
	 	.lines()
	 	.each(function(line) {
	 		var output = line.trim();
	 		lineNum += 1;

	 		// run tests on the file
	 		return tests(line, lineNum, output);
		})
		.onComplete(function() {
			// are we done yet? only output warnings and errors when on the last file
			if (currFile > len) {
				return done();
			}
		});
}


// run test if set to true in config object
function tests(line, num, output) {
	// check for space after // comment (//comment is invalid)
	if (config.comments === true && commentStyleCorrect(line) === false) {
		warnings.push('Space after comment is preferred:\nLine: ' +  num+ ': ' + output);
	}

	// check for 0px (margin 0 is preferred over margin 0px)
	if (config.unecessaryPX === true && pxStyleCorrect(line) === false) {
		warnings.push('0 is preferred over 0px.\nLine: ' + num + ': ' + output);
	}

	// check for * selector (* is discouraged)
	if (config.universal === true && universalSelector(line) === true) {
		warnings.push('* selector is slow. Consider a different selector.\nLine: ' + num + ': ' + output);
	}

	// check for unecessary : (margin 0 is preferred over margin: 0)
	if (config.colons === true && colon(line) === true) {
		warnings.push('Unecessary colon found:\nLine: ' + num + ': ' + output);
	}

	// check for unecessary ; (margin 0; is invalid)
	if (config.semicolons === true && semicolon(line) === true) {
		warnings.push('Unecessary semicolon found:\nLine: ' + num + ': ' + output);
	}

	// check for places where we can be more efficient (margin 0 50px vs margin 0 50px 0 50px)
	if (config.efficient === true && efficient(line) === true) {
		warnings.push('The properties on this line could be more succinct:\nLine: ' + num + ': ' + output);
	}

	// if (config.spaces === true && config.tabs === false) {
	// 	if (tabs(line) === true) {
	// 		warnings.push('Mixed spaces and tabs:\nLine: ' + num + ': ' + output);
	// 	}
	// }

	// if (config.tabs === true && config.spaces === false) {
	// 	if (spaces(line) === true) {
	// 		warnings.push('Mixed spaces and tabs:\nLine: ' + num + ': ' + output);
	// 	}
	// }

	// check selector depth
	if (config.depth === true) {
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
}


/**
 * display all warnings, errors, and line nos where they occur
 * display total number of both. if over the set limit, display a uh, slightly more stern message i guess
 * @return {[type]} [description]
 */
function done() {
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