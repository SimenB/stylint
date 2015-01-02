// modules
const
    argv                    = require('yargs').argv,
    chalk                   = require('chalk'),
    done                    = require('./done'),
    blockStyleCorrect       = require('./checks/checkBlockStyle'),
    brackets                = require('./checks/checkForBrackets'),
    checkBorderNone         = require('./checks/checkBorderNone'),
    colon                   = require('./checks/checkForColon'),
    commaStyleCorrect       = require('./checks/checkCommaStyle'),
    commentStyleCorrect     = require('./checks/checkCommentStyle'),
    cssLiteral              = require('./checks/checkForCssLiteral'),
    efficient               = require('./checks/checkForEfficiency'),
    extendStyleCorrect      = require('./checks/checkForExtendStyle'),
    hasComment              = require('./checks/checkForComment'),
    hashEnding              = require('./checks/checkForHashEnd'),
    hashStarting            = require('./checks/checkForHashStart'),
    leadingZero             = require('./checks/checkForLeadingZero'),
    mixedSpacesAndTabs      = require('./checks/checkForMixedSpacesTabs'),
    namingConvention        = require('./checks/checkNamingConvention'),
    parenStyleCorrect       = require('./checks/checkForParenStyle'),
    placeholderStyleCorrect = require('./checks/checkForPlaceholderStyle'),
    semicolon               = require('./checks/checkForSemicolon'),
    startsWithComment       = require('./checks/checkForCommentStart'),
    tooMuchNest             = require('./checks/checkNesting'),
    universalSelector       = require('./checks/checkForUniversal'),
    whitespace              = require('./checks/checkForTrailingWhitespace'),
    varStyleCorrect         = require('./checks/checkVarStyle'),
    zeroUnits               = require('./checks/checkForZeroUnits');

// other stuff
var
    enabled = true,
    cssBlock = false,
    areWeInAHash = false,
    stylintToggleBlock = false,
    warnings = [];


/**
 * @description runs tests
 * @param  {boolean} areWeDone [if no more tests to run calls the done function]
 * @param  {object} config    [our config object, how we know what tests to run]
 * @param  {string} line      [the curr line being tested, in its original form]
 * @param  {number} num       [line number being tested]
 * @param  {string} output    [trimmed line to output]
 * @param  {string} file      [name of file being tested]
 * @return {function}         [description]
 */
module.exports = function test( areWeDone, config, line, num, output, file ) {
    'use strict';

    if ( areWeDone ) {
        return done( warnings, config );
    }

    var strict = false;

    // if strict flag passed, run all tests
    if ( argv.s || argv.strict ) {
        strict = true;
    }

    // check for @stylint off comments
    if ( hasComment( line ) ) {
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
                    warnings.push( chalk.yellow('line comments require a space after //') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
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
            if ( hashEnding( line, areWeInAHash ) ) {
                areWeInAHash = false;
                return;
            }

            // check that commas are followed by a space
            if ( config.cssLiteral || strict ) {
                if ( cssLiteral(line) ) {
                    warnings.push( chalk.yellow('refrain from using css literals') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                    return;
                }
            }

            // check for brackets (except in hash)
            if ( config.brackets || strict ) {
                if ( brackets(line, areWeInAHash) && !cssBlock ) {
                    warnings.push( chalk.yellow('unecessary bracket') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check that commas are followed by a space
            if ( config.commaSpace || strict ) {
                if ( commaStyleCorrect(line) === false ) {
                    warnings.push( chalk.yellow('commas must be followed by a space for readability') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for extra spaces when using parens
            if ( config.mixinSpace || config.parenSpace || strict ) {
                if ( parenStyleCorrect(line) === false ) {
                    warnings.push( chalk.yellow('( $param1, $param2 ) is preferred over ($param1, $param2)') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
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
                config.extendPref = strict ? '@extends' : false;

                if ( extendStyleCorrect(line, config.extendPref) === false ) {
                    warnings.push( chalk.yellow('please use the ' + config.extendPref + ' syntax when extending') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for naming convention preference
            if ( config.namingConvention || strict ) {
                config.namingConvention = strict ? 'lowercase-dash' : false;

                if ( namingConvention(line, config.namingConvention) === false ) {
                    warnings.push( chalk.yellow('preferred naming convention is ' + config.namingConvention) + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
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

            // check valid properties and values
            // if ( config.valid || strict ) {
            //  if ( checkValidity( line, valid ) === false ) {
            //      warnings.push( chalk.yellow('property is not valid css') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
            //  }
            // }

            // check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
            if ( config.zeroUnits || config.unecessaryPx || strict ) {
                if ( zeroUnits(line) ) {
                    warnings.push( chalk.yellow('0 is preferred. Unit value is unnecessary') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }
        }
    }
}