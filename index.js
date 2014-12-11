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
 *       12. accept cli flags (partially implemented, needs more work)
 */


// modules
const fs    	= require('fs'), 			// base node file system module
      chalk 	= require('chalk'), 		// colorize outputs
      symbols 	= require('log-symbols'),	// symbols for output
      walk  	= require('./walk'), 		// walk logic
      Lazy  	= require('lazy.js'), 		// utility belt
      argv    	= require('yargs').argv;	// cli

// tests
const colon					= require('./tests/checkForColon'),
	  semicolon				= require('./tests/checkForSemicolon'),
	  commentStyleCorrect 	= require('./tests/checkCommentStyle'),
	  pxStyleCorrect		= require('./tests/checkForPx'),
	  universalSelector		= require('./tests/checkForUniversal'),
	  tooMuchNest			= require('./tests/checkNesting');

// duh
var config,
	warnings = [];

// set up config (if no config file passed in use default config)
if (!argv.config) {
	config = JSON.parse( fs.readFileSync('./.styluslintrc') );
}
else {
	config = JSON.parse( fs.readFileSync(argv.config) );
}

// display help message if user types --help
if (argv.help) {
	console.log(chalk.green('\nStylint v.0.0.1'));
	console.log('Usage: stylint [dir | file] [options]\n')
	console.log('Options:')
	console.log('--help', 'Display list of commands');
	console.log('--watch', 'Watch file or directory and run lint on change');
	console.log('--config', 'Pass in location of custom config file');
	console.log('--strict', 'Run all tests, allow no warnings or errors\n');
}


/**
 * check if second argument passed is a file or directory
 * if file just run tests on it directly, if dir walk through it and run tests on each file
 * @param {error} [err] [if err kill it]
 * @param the stat object for process.argv[2]
 * @returns void
 */
fs.stat(process.argv[2], function(err, stats) {
	if (err) return;

	if (stats.isFile()) {
		return lazyParse(process.argv[2], 0, 1);
	}
	else if (stats.isDirectory()) {
		//walk dir, iterate through files, read line by line, output warnings and errors
		walk(process.argv[2], function(err, files) {
			if (err) throw err;
			var i = 0,
				len = files.length - 1;

			// iterate over every file
			Lazy(files).each(function(file) {
				i++;
				return lazyParse(file, len, i);
			});
		});
	}
});


// pass in file and parse it with lazy
function lazyParse(file, len, currFile) {
	var lineNum = 0;

	// read file line by line and run tests
	Lazy.strict()
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

	// check selector depth
	if (config.depth === true) {
		// if you're a bad person and you set tabs and spaces to both be true, default to tabs
		if (config.tabs === true && config.spaces == true) {
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
		console.log('\n' + symbols.success, ' ' + chalk.green('Stylint: You\'re all clear!\n'))
	}
	else {
	    console.log('\n' + symbols.warning, ' ' + chalk.yellow(' ' + warnings.length + ' Warnings\n'));
	}
}