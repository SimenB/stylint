'use strict';

var valid = require('./data/getValid')();

/**
 * @description runs tests
 * @param  {string} line      [the curr line being tested, in its original form]
 * @param  {number} num       [line number being tested]
 * @param  {string} output    [trimmed line to output]
 * @param  {string} file      [name of file being tested]
 * @return void
 */
module.exports = function test( app, line, num, output, file ) {
	// just some convenience stuff
	var arr = line.split(' '),
		cache = app.cache,
		state = app.state;

	// check for @stylint off comments
	if ( app.commentExists( line ) ) {
		/**
		 * these first two tests determine if the rest of the tests should run
		 * if @stylint: off comment found, disable tests until @stylint: on comment found
		 */
		if ( line.indexOf('@stylint off') !== -1 ) {
			state.toggleBlock = true;
			state.testsEnabled = false;
			return;
		}

		if ( state.toggleBlock && line.indexOf('@stylint on') !== -1 ) {
			state.toggleBlock = false;
			state.testsEnabled = true;
		}
	}

	// by default we skip css literals, but if css literal option set to true we throw a warning
	if ( app.config.cssLiteral === false && line.indexOf('@css') !== -1 ) {
		state.cssBlock = true;
		return;
	}

	// if we're in a css block, check for the end of it
	if ( state.cssBlock ) {
		state.testsEnabled = false;

		// hash ending checks for } as the first character
		if ( app.hashEnd(line, true) ) {
			state.cssBlock = false;
			state.testsEnabled = true;
			return;
		}
	}

	// are we running any tests at all?
	if ( state.testsEnabled ) {

		// check for comment style (//dont do this. // do this)
		if ( app.commentExists(line) ) {
			if ( app.config.commentSpace || state.strictMode ) {
				if ( app.commentSpace(line) === false ) {
					cache.warnings.push( 'line comments require a space after //' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}
		}

		// does the line start with a comment? dont run the following tests
		if ( !app.startsWithComment(line) ) {

			// does the line have a comment after the stylus? trim it before we run tests
			if ( app.commentExists(line) ) {
				line = line.slice( 0, line.indexOf('//') - 1 );
			}

			// the only valid use of brackets is in a hash
			// @TODO prolly shouldn't return here
			// there are checks we can do inside a hash
			if ( app.hashStart(line) ) {
				this.state.hash = true;
				return;
			}

			// if the above equals true we check for the end of the hash
			if ( app.hashEnd( line, this.state.hash ) ) {
				this.state.hash = false;
				return;
			}

			// check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
			if ( app.config.alphabetical || state.strictMode ) {
				if ( !app.alphabet( line, valid ) ) {
					cache.warnings.push(  'Property is not in alphabetical order' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check that commas are followed by a space
			if ( app.config.cssLiteral || state.strictMode ) {
				if ( app.cssLiteral(line) ) {
					cache.warnings.push( 'refrain from using css literals' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
					return;
				}
			}

			// check for brackets (except in hash)
			if ( app.config.brackets || state.strictMode ) {
				if ( app.brackets( line ) && !state.cssBlock && !this.state.hash ) {
					cache.warnings.push( 'unecessary bracket' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check that commas are followed by a space
			if ( app.config.commaSpace || state.strictMode ) {
				if ( app.comma(line) === false ) {
					cache.warnings.push( 'commas must be followed by a space for readability' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check that commas are followed by a space
			if ( app.config.duplicates || state.strictMode ) {
				if ( app.duplicates( line, file ) ) {
					cache.warnings.push( 'duplicate property or selector, consider merging' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for extra spaces when using parens
			if ( app.config.mixinSpace || app.config.parenSpace || state.strictMode ) {
				if ( app.paren(line) === false ) {
					cache.warnings.push( '( param1, param2 ) is preferred over (param1, param2)' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for border none (prefer border 0)
			if ( app.config.borderNone || state.strictMode ) {
				if ( app.borderNone(line) ) {
					cache.warnings.push( 'border 0 is preferred over border none' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for border none (prefer border 0)
			if ( app.config.leadingZero || state.strictMode ) {
				if ( app.leadingZero( line, arr ) ) {
					cache.warnings.push( 'leading zeros for decimal points are unecessary' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for @block when defining block var
			if ( app.config.enforceBlockStyle || state.strictMode ) {
				if ( app.block(line) === false ) {
					cache.warnings.push( 'block variables must include @block' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for @extend(s) preference
			if ( app.config.extendPref || state.strictMode ) {
				if ( state.strictMode && app.config.extendPref === false ) {
					app.config.extendPref = '@extends';
				}

				if ( app.extend(line, app.config.extendPref) === false ) {
					cache.warnings.push( 'please use the ' + app.config.extendPref + ' syntax when extending' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for naming convention preference
			if ( app.config.namingConvention || state.strictMode ) {
				if ( state.strictMode && app.config.namingConvention === false ) {
					app.config.namingConvention = 'lowercase-dash';
				}

				if ( app.namingConvention(line, app.config.namingConvention) === false ) {
					cache.warnings.push( 'preferred naming convention is ' + app.config.namingConvention + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// only extend placeholder vars (or not)
			if ( app.config.placeholders || state.strictMode ) {
				if ( app.placeholder(line) === false ) {
					cache.warnings.push( 'please extend only placeholder vars' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for $ at start of var
			if ( app.config.enforceVarStyle || state.strictMode ) {
				if ( app.varStyle(line) === false ) {
					cache.warnings.push( 'variables must be prefixed with the $ sign.' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for * selector (* is discouraged)
			if ( app.config.universal || state.strictMode ) {
				if ( app.universal( line, arr ) ) {
					cache.warnings.push( '* selector is slow. Consider a different selector.' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for unecessary : (margin 0 is preferred over margin: 0)
			if ( app.config.colons || state.strictMode ) {
				if ( app.colon( line, state.hash ) ) {
					cache.warnings.push( 'unecessary colon found:' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}


			// prefer vars instead of loose hex values
			if ( app.config.colors || state.strictMode ) {
				if ( app.colors( line ) ) {
					cache.warnings.push( 'hexidecimal color should be a variable:' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for unecessary ; (margin 0; is invalid)
			if ( app.config.semicolons || state.strictMode ) {
				if ( app.semicolon(line) ) {
					cache.warnings.push( 'unecessary semicolon found:' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for places where we can be more efficient (margin 0 50px vs margin 0 50px 0 50px)
			if ( app.config.efficient || state.strictMode ) {
				if ( app.efficient( line, arr ) === false ) {
					cache.warnings.push( 'the value on this line could be more succinct:' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check mixed spaces and tabs
			if ( app.config.mixed || state.strictMode ) {
				// else check tabs against tabs and spaces against spaces
				if ( app.mixed( line, arr, app.config.indentSpaces ) ) {
					cache.warnings.push( 'mixed spaces and tabs' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for trailing whitespace
			if ( app.config.trailingWhitespace || state.strictMode ) {
				if ( app.whitespace( line ) ) {
					cache.warnings.push( 'trailing whitespace' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check selector depth
			if ( app.config.depthLimit || state.strictMode ) {
				if ( state.strictMode && app.config.depthLimit === false ) {
					app.config.depthLimit = 4;
				}
				// else check tabs against tabs and spaces against spaces
				if ( app.nesting( line, arr, app.config.depthLimit, app.config.indentSpaces ) ) {
					cache.warnings.push( 'selector depth greater than', app.config.depthLimit + ':' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check valid properties and values
			if ( app.config.quotePref || state.strictMode ) {
				if ( app.quotes( line, app.config.quotePref ) === false ) {
					cache.warnings.push( 'preferred quote style is ' + app.config.quotePref + ' quotes' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check valid properties and values
			if ( app.config.valid || state.strictMode ) {
				if ( app.valid( line, valid ) === false ) {
					cache.warnings.push( 'property is not valid' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
			if ( app.config.zeroUnits || app.config.unecessaryPx || state.strictMode ) {
				if ( app.zeroUnits(line) ) {
					cache.warnings.push(  '0 is preferred. Unit value is unnecessary' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
			if ( app.config.zIndexDuplicates || state.strictMode ) {

				if ( app.zIndexDupe( line ) ) {
					cache.warnings.push(  'this z-index value is already being used elsewhere' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			if ( app.config.zIndexNormalize || state.strictMode ) {
				if ( app.zIndexNormalize( line ) ) {
					cache.warnings.push(  'this z-index value is not normalized' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}
		}
	}

	// if the latest round of tests put us over the limit
	// output the list of errors, and throw
	if ( cache.warnings.length > app.config.maxWarnings && app.config.maxWarningsKill ) {
		app.done( app, 'kill' );
	}
}
