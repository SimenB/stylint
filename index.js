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
 *       6. check for * selector (partially implemented, needs bulletproofing)
 *       7. check for spaces vs tabs (error out if using spaces, or tabs, depending on config) @NOT DONE
 *       8. check for 0 0 0 0 or 50px 50px 50px type mistakes @NOT DONE
 *       9. check for alphabetical order @NOT DONE
 *       10. check for duplicate selectors @NOT DONE
 *       11. check for valid properties @NOT DONE
 *       11. make configurable via .json @DONE
 *       12. accept cli flags (like --force) @NOT DONE
 */


// modules
const fs    = require('fs'), 			// base node file system module
      chalk = require('chalk'), 		// colorize outputs
      walk  = require('./walk'), 		// walk logic
      Lazy  = require('lazy.js'), 		// utility belt
      prog  = require('commander'); 	// cli


// tests
const colon					= require('./tests/checkForColon'),
	  semicolon				= require('./tests/checkForSemicolon'),
	  commentStyleCorrect 	= require('./tests/checkCommentStyle'),
	  pxStyleCorrect		= require('./tests/checkForPx'),
	  universalSelector		= require('./tests/checkForUniversal'),
	  tooMuchNest			= require('./tests/checkNesting');

var errors 	 = [],
	warnings = [];


// set up cli
prog
	.version('0.0.1')
	.option('-w, --watch', 'Watch file or directory and run lint on change')
	.option('-c, --config', 'Pass in location of config file')
	.parse(process.argv);


// set up config
var config = undefined;
if (!prog.config) {
	config = JSON.parse(fs.readFileSync('./.styluslintrc'));
}
else {
	config = prog.config;
}


// walk dir, iterate through files, read line by line, output warnings and errors
walk(process.argv[2], function(err, files) {
	if (err) throw err;
	var len = files.length - 1,
		fileCount = 0;

	// iterate over every file
	Lazy(files).each(function(file) {
		var l = 0; // l is for line

		// read file line by line and run tests
		Lazy.strict()
			.readFile(file)
		 	.lines()
		 	.each(function(line) {
		 		var output = line.trim();
		 		l += 1;

		 		// if config file present, only run command if set to true. otherwise run everything
		 		tests(line, l, output);
			})
			.onComplete(function() {
				var totalWarnings = warnings.length,
					totalErrors	= errors.length,
					i = 0, j = 0;

				fileCount += 1;

				// are we done yet? only output warnings and errors when on the last file
				if (fileCount === len) {
					// if (errors.length > 3) {
					// 	console.error(chalk.bold.red('Splinter: Too many errors. Aborting.'));
					// }
					// else {
				    for (i; i < totalWarnings; i++) {
				        // process.stdout.write( chalk.yellow('Warning: ' + warnings[i]) + '\n\n' );
				    }

				    for (j; j < totalErrors; j++) {
				        // process.stdout.write( chalk.red('Error: ' + errors[j]) + '\n\n' );
				    }

				    process.stdout.write(chalk.white('Total Warnings: ' + warnings.length + '\n'));
				    process.stdout.write(chalk.white('Total Errors: ' + errors.length + '\n'));
					// }
				}
			});
	});
});


// all tests
function tests(line, l, output) {
	// check for space after // comment (//comment is invalid)
	if (config && config.comments === true && commentStyleCorrect(line) === false) {
		warnings.push('Space after comment is preferred:\nLine: ' + l + ': ' + output);
	}
	else if (commentStyleCorrect(line) === false) {
		warnings.push('Space after comment is preferred:\nLine: ' + l + ': ' + output);
	}

	// check for 0px (margin 0 is preferred over margin 0px)
	if (config && config.unecessaryPX === true && pxStyleCorrect(line) === false) {
		warnings.push('0 is preferred over 0px.\nLine: ' + l + ': ' + output);
	}
	else if (pxStyleCorrect(line) === false) {
		warnings.push('0 is preferred over 0px.\nLine: ' + l + ': ' + output);
	}

	// check for * selector (* is discouraged)
	if (config && config.universal === true && universalSelector(line) === true) {
		warnings.push('* selector is slow. Consider a different selector.\nLine: ' + l + ': ' + output);
	}
	else if (universalSelector(line) === true) {
		warnings.push('* selector is slow. Consider a different selector.\nLine: ' + l + ': ' + output);
	}

	// check for unecessary : (margin 0 is preferred over margin: 0)
	if (config && config.colons === true && colon(line) === true) {
		warnings.push('Unecessary colon found:\nLine: ' + l + ': ' + output);
	}
	else if (colon(line) === true) {
		warnings.push('Unecessary colon found:\nLine: ' + l + ': ' + output);
	}

	// check for unecessary ; (margin 0; is invalid)
	if (config && config.semicolons === true && semicolon(line) === true) {
		errors.push('Unecessary semicolon found:\nLine: ' + l + ': ' + output);
	}
	else if (semicolon(line) === true) {
		errors.push('Unecessary semicolon found:\nLine: ' + l + ': ' + output);
	}

	// check selector depth
	if (config && config.depth === true && tooMuchNest(line, config.depthLimit) === true) {
		errors.push('Selector depth greater than 4:\nLine: ' + l + ': ' + output);
	}
	else if (tooMuchNest(line, 4) === true) {
		errors.push('Selector depth greater than 4:\nLine: ' + l + ': ' + output);
	}
}
