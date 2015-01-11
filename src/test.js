const
    chalk = require('chalk'),
    valid = require('./data/getValid')();


/**
 * @description runs tests
 * @param  {string} line      [the curr line being tested, in its original form]
 * @param  {number} num       [line number being tested]
 * @param  {string} output    [trimmed line to output]
 * @param  {string} file      [name of file being tested]
 * @return void
 */
module.exports = function test( app, line, num, output, file ) {
    'use strict';
    // just some convenience stuff
    var config = app.config,
        state = app.state,
        warns = app.warnings,
        arr = line.split(' ');

    // check for @stylint off comments
    if ( app.hasComment( line ) ) {
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
    if ( config.cssLiteral === false && line.indexOf('@css') !== -1 ) {
        state.cssBlock = true;
        return;
    }

    // if we're in a css block, check for the end of it
    if ( state.cssBlock ) {
        state.testsEnabled = false;

        // hash ending checks for } as the first character
        if ( app.hashEnding(line, true) ) {
            state.cssBlock = false;
            state.testsEnabled = true;
            return;
        }
    }

    // are we running any tests at all?
    if ( state.testsEnabled ) {
        // check for comment style (//dont do this. // do this)
        if ( app.hasComment(line) ) {
            if ( config.commentSpace || state.strictMode ) {
                if ( app.commentStyleCorrect(line) === false ) {
                    warns.push( chalk.yellow('line comments require a space after //') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }
        }

        // does the line start with a comment? dont run the following tests
        if ( !app.startsWithComment(line) ) {

            // does the line have a comment after the stylus? trim it before we run tests
            if ( app.hasComment(line) ) {
                line = line.slice( 0, line.indexOf('//') - 1 );
            }

            // the only valid use of brackets is in a hash
            if ( app.hashStarting(line) ) {
                state.hash = true;
                return;
            }

            // if the above equals true we check for the end of the hash
            if ( app.hashEnding( line, state.hash ) ) {
                state.hash = false;
                return;
            }

            // check that commas are followed by a space
            if ( config.cssLiteral || state.strictMode ) {
                if ( app.cssLiteral(line) ) {
                    warns.push( chalk.yellow('refrain from using css literals') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                    return;
                }
            }

            // check for brackets (except in hash)
            if ( config.brackets || state.strictMode ) {
                if ( app.brackets( line, state.hash ) && !state.cssBlock ) {
                    warns.push( chalk.yellow('unecessary bracket') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check that commas are followed by a space
            if ( config.commaSpace || state.strictMode ) {
                if ( app.commaStyleCorrect(line) === false ) {
                    warns.push( chalk.yellow('commas must be followed by a space for readability') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for extra spaces when using parens
            if ( config.mixinSpace || config.parenSpace || state.strictMode ) {
                if ( app.parenStyleCorrect(line) === false ) {
                    warns.push( chalk.yellow('( param1, param2 ) is preferred over (param1, param2)') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for border none (prefer border 0)
            if ( config.borderNone || state.strictMode ) {
                if ( app.checkBorderNone(line) ) {
                    warns.push( chalk.yellow('border 0 is preferred over border none') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for border none (prefer border 0)
            if ( config.leadingZero || state.strictMode ) {
                if ( app.leadingZero( line, arr ) ) {
                    warns.push( chalk.yellow('leading zeros for decimal points are unecessary') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for @block when defining block var
            if ( config.enforceBlockStyle || state.strictMode ) {
                if ( app.blockStyleCorrect(line) === false ) {
                    warns.push( chalk.yellow('block variables must include @block') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for @extend(s) preference
            if ( config.extendPref || state.strictMode ) {
                if ( state.strictMode && config.extendPref === false ) {
                    config.extendPref = '@extends';
                }

                if ( app.extendStyleCorrect(line, config.extendPref) === false ) {
                    warns.push( chalk.yellow('please use the ' + config.extendPref + ' syntax when extending') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for naming convention preference
            if ( config.namingConvention || state.strictMode ) {
                if ( state.strictMode && config.namingConvention === false ) {
                    config.namingConvention = 'lowercase-dash';
                }

                if ( app.namingConvention(line, config.namingConvention) === false ) {
                    warns.push( chalk.yellow('preferred naming convention is ' + config.namingConvention) + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // only extend placeholder vars (or not)
            if ( config.placeholders || state.strictMode ) {
                if ( app.placeholderStyleCorrect(line) === false ) {
                    warns.push( chalk.yellow('please extend only placeholder vars') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for $ at start of var
            if ( config.enforceVarStyle || state.strictMode ) {
                if ( app.varStyleCorrect(line) === false ) {
                    warns.push( chalk.yellow('variables must be prefixed with the $ sign.') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for * selector (* is discouraged)
            if ( config.universal || state.strictMode ) {
                if ( app.universalSelector(line) ) {
                    warns.push( chalk.yellow('* selector is slow. Consider a different selector.') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for unecessary : (margin 0 is preferred over margin: 0)
            if ( config.colons || state.strictMode ) {
                if ( app.colon( line, state.hash ) ) {
                    warns.push( chalk.yellow('unecessary colon found:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for unecessary ; (margin 0; is invalid)
            if ( config.semicolons || state.strictMode ) {
                if ( app.semicolon(line) ) {
                    warns.push( chalk.yellow('unecessary semicolon found:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for places where we can be more efficient (margin 0 50px vs margin 0 50px 0 50px)
            if ( config.efficient || state.strictMode ) {
                if ( app.efficient( line, arr ) === false ) {
                    warns.push( chalk.yellow('the value on this line could be more succinct:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check mixed spaces and tabs
            if ( config.mixed || state.strictMode ) {
                // console.log( config.indentSpaces );
                // else check tabs against tabs and spaces against spaces
                if ( app.mixedSpacesAndTabs( line, config.indentSpaces ) ) {
                    warns.push( chalk.yellow('mixed spaces and tabs') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for trailing whitespace
            if ( config.trailingWhitespace || state.strictMode ) {
                if ( app.whitespace( line ) ) {
                    warns.push( chalk.yellow('trailing whitespace') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check selector depth
            if ( config.depthLimit || state.strictMode ) {
                if ( state.strictMode && config.depthLimit === false ) {
                    config.depthLimit = 4;
                }
                // else check tabs against tabs and spaces against spaces
                if ( app.tooMuchNest( line, arr ) ) {
                    warns.push( chalk.yellow('selector depth greater than', config.depthLimit + ':') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check valid properties and values
            if ( config.valid || state.strictMode ) {
                if ( app.validProperty( line, valid ) === false ) {
                    warns.push( chalk.yellow('property is not valid') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
                // if ( validValue( line, arr, validCSS, validHTML ) === false ) {
                //     warns.push( chalk.yellow('value is not valid') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                // }
            }

            // check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
            if ( config.zeroUnits || config.unecessaryPx || state.strictMode ) {
                if ( app.zeroUnits(line) ) {
                    warns.push( chalk.yellow('0 is preferred. Unit value is unnecessary') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
            // if ( config.zIndexr || state.strictMode ) {
            //     if ( zIndexr(line, arr, config.zIndexr) ) {
            //         warns.push( chalk.yellow('0 is preferred. Unit value is unnecessary') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
            //     }
            // }
        }
    }
}