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
	var arr = line.split(' ');

	// check for @stylint off comments
	if ( app.commentExists( line ) ) {
		/**
		 * these first two tests determine if the rest of the tests should run
		 * if @stylint: off comment found, disable tests until @stylint: on comment found
		 */
		if ( line.indexOf('@stylint off') !== -1 ) {
			app.state.toggleBlock = true;
			app.state.testsEnabled = false;
			return;
		}

		if ( app.state.toggleBlock && line.indexOf('@stylint on') !== -1 ) {
			app.state.toggleBlock = false;
			app.state.testsEnabled = true;
		}
	}

	// by default we skip css literals, but if css literal option set to true we throw a warning
	if ( app.config.cssLiteral === false && line.indexOf('@css') !== -1 ) {
		app.state.cssBlock = true;
		return;
	}

	// if we're in a css block, check for the end of it
	if ( app.state.cssBlock ) {
		app.state.testsEnabled = false;

		// hash ending checks for } as the first character
		if ( app.hashEnd(line, true) ) {
			app.state.cssBlock = false;
			app.state.testsEnabled = true;
			return;
		}
	}

	// are we running any tests at all?
	if ( app.state.testsEnabled ) {
		// check for comment style (//dont do this. // do this)
		if ( app.commentExists(line) ) {
			if ( app.config.commentSpace || app.state.strictMode ) {
				if ( app.commentSpace(line) === false ) {
					app.warnings.push( 'line comments require a space after //' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
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
			if ( app.hashStart(line) ) {
				app.state.hash = true;
				return;
			}

			// if the above equals true we check for the end of the hash
			if ( app.hashEnd( line, app.state.hash ) ) {
				app.state.hash = false;
				return;
			}

			// check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
			if ( app.config.alphabetical || app.state.strictMode ) {
				if ( !app.alphabet( line, valid ) ) {
					app.warnings.push(  'Property is not in alphabetical order' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check that commas are followed by a space
			if ( app.config.cssLiteral || app.state.strictMode ) {
				if ( app.cssLiteral(line) ) {
					app.warnings.push( 'refrain from using css literals' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
					return;
				}
			}

			// check for brackets (except in hash)
			if ( app.config.brackets || app.state.strictMode ) {
				if ( app.brackets( line, app.state.hash ) && !app.state.cssBlock ) {
					app.warnings.push( 'unecessary bracket' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check that commas are followed by a space
			if ( app.config.commaSpace || app.state.strictMode ) {
				if ( app.comma(line) === false ) {
					app.warnings.push( 'commas must be followed by a space for readability' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check that commas are followed by a space
			if ( app.config.duplicates || app.state.strictMode ) {
				if ( app.duplicates( line, file ) ) {
					app.warnings.push( 'duplicate property or selector, consider merging' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for extra spaces when using parens
			if ( app.config.mixinSpace || app.config.parenSpace || app.state.strictMode ) {
				if ( app.paren(line) === false ) {
					app.warnings.push( '( param1, param2 ) is preferred over (param1, param2)' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for border none (prefer border 0)
			if ( app.config.borderNone || app.state.strictMode ) {
				if ( app.borderNone(line) ) {
					app.warnings.push( 'border 0 is preferred over border none' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for border none (prefer border 0)
			if ( app.config.leadingZero || app.state.strictMode ) {
				if ( app.leadingZero( line, arr ) ) {
					app.warnings.push( 'leading zeros for decimal points are unecessary' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for @block when defining block var
			if ( app.config.enforceBlockStyle || app.state.strictMode ) {
				if ( app.block(line) === false ) {
					app.warnings.push( 'block variables must include @block' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for @extend(s) preference
			if ( app.config.extendPref || app.state.strictMode ) {
				if ( app.state.strictMode && app.config.extendPref === false ) {
					app.config.extendPref = '@extends';
				}

				if ( app.extend(line, app.config.extendPref) === false ) {
					app.warnings.push( 'please use the ' + app.config.extendPref + ' syntax when extending' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for naming convention preference
			if ( app.config.namingConvention || app.state.strictMode ) {
				if ( app.state.strictMode && app.config.namingConvention === false ) {
					app.config.namingConvention = 'lowercase-dash';
				}

				if ( app.namingConvention(line, app.config.namingConvention) === false ) {
					app.warnings.push( 'preferred naming convention is ' + app.config.namingConvention + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// only extend placeholder vars (or not)
			if ( app.config.placeholders || app.state.strictMode ) {
				if ( app.placeholder(line) === false ) {
					app.warnings.push( 'please extend only placeholder vars' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for $ at start of var
			if ( app.config.enforceVarStyle || app.state.strictMode ) {
				if ( app.varStyle(line) === false ) {
					app.warnings.push( 'variables must be prefixed with the $ sign.' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for * selector (* is discouraged)
			if ( app.config.universal || app.state.strictMode ) {
				if ( app.universal( line, arr ) ) {
					app.warnings.push( '* selector is slow. Consider a different selector.' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for unecessary : (margin 0 is preferred over margin: 0)
			if ( app.config.colons || app.state.strictMode ) {
				if ( app.colon( line, app.state.hash ) ) {
					app.warnings.push( 'unecessary colon found:' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}


			// prefer vars instead of loose hex values
			if ( app.config.colors || app.state.strictMode ) {
				if ( app.colors( line ) ) {
					app.warnings.push( 'hexidecimal color should be a variable:' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for unecessary ; (margin 0; is invalid)
			if ( app.config.semicolons || app.state.strictMode ) {
				if ( app.semicolon(line) ) {
					app.warnings.push( 'unecessary semicolon found:' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for places where we can be more efficient (margin 0 50px vs margin 0 50px 0 50px)
			if ( app.config.efficient || app.state.strictMode ) {
				if ( app.efficient( line, arr ) === false ) {
					app.warnings.push( 'the value on this line could be more succinct:' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check mixed spaces and tabs
			if ( app.config.mixed || app.state.strictMode ) {
				// console.log( app.config.indentSpaces );
				// else check tabs against tabs and spaces against spaces
				if ( app.mixed( line, arr, app.config.indentSpaces ) ) {
					app.warnings.push( 'mixed spaces and tabs' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for trailing whitespace
			if ( app.config.trailingWhitespace || app.state.strictMode ) {
				if ( app.whitespace( line ) ) {
					app.warnings.push( 'trailing whitespace' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check selector depth
			if ( app.config.depthLimit || app.state.strictMode ) {
				if ( app.state.strictMode && app.config.depthLimit === false ) {
					app.config.depthLimit = 4;
				}
				// else check tabs against tabs and spaces against spaces
				if ( app.nesting( line, arr ) ) {
					app.warnings.push( 'selector depth greater than', app.config.depthLimit + ':' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check valid properties and values
			if ( app.config.quotePref || app.state.strictMode ) {
				if ( app.quotes( line, app.config.quotePref ) === false ) {
					app.warnings.push( 'preferred quote style is ' + app.config.quotePref + ' quotes' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check valid properties and values
			if ( app.config.valid || app.state.strictMode ) {
				if ( app.valid( line, valid ) === false ) {
					app.warnings.push( 'property is not valid' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
			if ( app.config.zeroUnits || app.config.unecessaryPx || app.state.strictMode ) {
				if ( app.zeroUnits(line) ) {
					app.warnings.push(  '0 is preferred. Unit value is unnecessary' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			// check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
			if ( app.config.zIndexDuplicates || app.state.strictMode ) {

				if ( app.zIndexDupe( line ) ) {
					app.warnings.push(  'this z-index value is already being used elsewhere' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}

			if ( app.config.zIndexNormalize || app.state.strictMode ) {
				if ( app.zIndexNormalize( line ) ) {
					app.warnings.push(  'this z-index value is not normalized' + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
				}
			}
		}
	}

	// if the latest round of tests put us over the limit
	// output the list of errors, and throw
	if ( app.warnings.length > app.config.maxWarnings && app.config.maxWarningsKill ) {
		app.done( app, 'kill' );
	}
}
