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
 *       11. make configurable via .json @NOT DONE
 *       12. accept cli flags (like --force) @NOT DONE
 */


// modules
const   fs          = require('fs'),
        chalk       = require('chalk'),
        fileinput   = require('fileinput'),
        stream      = require('stream'),
        readline    = require('readline'),
        lineReader 	= require('line-reader'),
        lazy		= require('lazy'),
        _           = require('lodash');


// regexes
const   comment = /\/\/\s/,                 // check for space after comment line
        starS   = /(\* )/,                 	// check for space after star (inside a docblockr comment)
        starO   = /(\/\*\*)/ || /(\/\*)/,   // check for star selector as opening comment
        starE   = /(\*\/)/,                 // finally, check for star selector as closing comment
        tabs	= /^(\t)*/,					// count indents
        amp 	= /^(\&)/,					// check if using & selector before we count tabs
        spaces	= /( ){4}\D\W+/g;			// if using spaces for indents, check consistency


// other stuff
var errors = [],
    warnings = [],
    files = [],
    count = 0;


// recursively walk a dir, get files
var walk = function(dir, done) {
	var results = [];

	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		var i = 0;

		(function next() {
			var file = list[i++];

			if (!file) return done(null, results);

			file = dir + '/' + file;

			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function(err, res) {
						results = results.concat(res);
						next();
					});
				}
				else {
					results.push(file);
					next();
				}
			});
		})();
	});
};


walk('test', function(err, files) {
	if (err) throw err;

	fileinput.input(files).on('line', function(line) {
	  	console.log('im doing something');
	    var line = line.toString(),
	    	output = line.trim();

		count += 1;

		// check comment style correctness
		if (line.indexOf('//') !== -1) {
		    // check for space after comment, if no space, return warning
		    if (!comment.test(line)) {
		        warnings.push('Space after comment is preferred:\nLine: ' + count + ': ' + output);
		    }
		}

	    // check for 0px
	    if (line.indexOf(' 0px') !== -1) {
	        warnings.push('0 is preferred over 0px.\nLine: ' + count + ': ' + output)
	    }

	    /**
	     * check for * selector. (super basic atm, @TODO needs to not trigger on regex selectors)
	     * technically this is used as part of resets often, for good reason, despite its slowness
	     * which is why i'm setting it up as a warning as it won't break code but you might prefer to not use it
	     */
	    if (line.indexOf('*') !== -1) {
	    	// check for various places where the * is valid (just comment checks atm)
	        if (!starO.test(line) && !starE.test(line) && !starS.test(line)) {
	            warnings.push('* selector is slow. Consider a different selector.\nLine: ' + count + ': ' + output);
	        }
	    }

	    // check for colons
	    if (line.indexOf(': ') !== -1) {
	        warnings.push('Unecessary colon found:\nLine: ' + count + ': ' + output)
	    }

	    // if using spaces, check for consistent indentation (in this case, 4 spaces per indent)
	    // also check that line is not commented out
	    if (!_.isNull(line.match(spaces)) && line.indexOf('/') === -1) {
	    	console.log(line.match(spaces).length);
	    	console.log('Indentation not consistent:\nLine: ' + count + ': ' + output);
			// if (!line.match(spaces.length % 4)) {
			// 	warnings.push('Indentation not consistent:\nLine: ' + count + ': ' + output);
			// }
	    }

	    // check for semicolons
	    if (line.indexOf(';') !== -1) {
	        errors.push('Unecessary semicolon found:\nLine: ' + count + ': ' + output)
	    }

	    /**
	     * issue error if nesting is greater than 3 and not starting with ampersand
	     * stuff like :hover for instance, shouldn't count towards selector depth @TODO finetune this
	     * also stuff like @media shouldn't count either @TODO
	     */
	    if (line.match(tabs)[0].length > 4 && !amp.test(line)) {
	    	errors.push('Selector depth greater than 4:\nLine: ' + count + ': ' + output);
	    }
	}).
	on('error', function(err) {
	    throw err;
	}).
	on('end', function() {

		// if (errors.length > 3) {
		// 	console.error(chalk.bold.red('Splinter: Too many errors. Aborting.'));
		// }
		// else {
		    for (var i = 0; i < warnings.length; i++) {
		        console.log( chalk.yellow('Warning: ' + warnings[i]) + '\n' );
		    }
		    for (var i = 0; i < errors.length; i++) {
		        console.log( chalk.red('Error: ' + errors[i]) + '\n' );
		    }

		    console.log(chalk.blue('Total Warnings: ' + warnings.length));
		    console.log(chalk.blue('Total Errors: ' + errors.length));
		// }
	});
});