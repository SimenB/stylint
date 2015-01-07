// modules
const
    chalk                   = require('chalk'),
    fs                      = require('fs'),
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
    validProperty           = require('./checks/checkForValidProperties'),
    validValue              = require('./checks/checkForValidValues'),
    varStyleCorrect         = require('./checks/checkVarStyle'),
    zeroUnits               = require('./checks/checkForZeroUnits'),
    zIndexr                 = require('./checks/zIndexr'),
    validCSS = JSON.parse( fs.readFileSync(__dirname + '/checks/validCSS.json') ),
    validHTML = [
        'a',
        'abbr',
        'abel',
        'acronym',
        'address',
        'applet',
        'area',
        'article',
        'aside',
        'audio',
        'b',
        'bdi',
        'bdo',
        'big',
        'blockquote',
        'body',
        'button',
        'button[disabled]',
        'br',
        'caption',
        'canvas',
        'cite',
        'code',
        'col',
        'colgroup',
        'data',
        'datalist',
        'dd',
        'del',
        'details',
        'dfn',
        'div',
        'dl',
        'dt',
        'em',
        'fieldset',
        'figure',
        'figcaption',
        'footer',
        'form',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'hr',
        'html',
        'i',
        'iframe',
        'img',
        'input',
        'input[disabled]',
        'input[type=submit]',
        'input[type="submit"]',
        "input[type='submit']",
        'input[type=search]',
        'input[type="search"]',
        "input[type='search']",
        'input[type=button]',
        'input[type="button"]',
        "input[type='button']",
        'input[type=reset]',
        'input[type="reset"]',
        "input[type='reset']",
        'ins',
        'kbd',
        'keygen',
        'label',
        'legend',
        'li',
        'main',
        'map',
        'mark',
        'math',
        'menu',
        'menuitem',
        'meter',
        'nav',
        'object',
        'ol',
        'optgroup',
        'option',
        'output',
        'param',
        'p',
        'pre',
        'progress',
        'q',
        'ruby',
        'rt',
        'rp',
        's',
        'samp',
        'section',
        'select',
        'small',
        'source',
        'span',
        'strike',
        'strong',
        'sub',
        'sup',
        'summary',
        'svg',
        'table',
        'tbody',
        'td',
        'textarea',
        'tfoot',
        'th',
        'thead',
        'time',
        'tr',
        'track',
        'tt',
        'ul',
        'var',
        'video',
        'wbr'
    ];


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
module.exports = function test( line, num, output, file ) {
    'use strict';
    // just some convenience stuff
    var config = this.config,
        arr = line.split(' ');

    // check for @stylint off comments
    if ( hasComment( line ) ) {
        /**
         * these first two tests determine if the rest of the tests should run
         * if @stylint: off comment found, disable tests until @stylint: on comment found
         */
        if ( line.indexOf('@stylint off') !== -1 ) {
            this.state.toggleBlock = true;
            this.state.testsEnabled = false;
            return;
        }

        if ( this.state.toggleBlock && line.indexOf('@stylint on') !== -1 ) {
            this.state.toggleBlock = false;
            this.state.testsEnabled = true;
        }
    }

    // by default we skip css literals, but if css literal option set to true we throw a warning
    if ( config.cssLiteral === false && line.indexOf('@css') !== -1 ) {
        this.state.cssBlock = true;
        return;
    }

    // if we're in a css block, check for the end of it
    if ( this.state.cssBlock ) {
        this.state.testsEnabled = false;

        // hash ending checks for } as the first character
        if ( hashEnding(line, true) ) {
            this.state.cssBlock = false;
            this.state.testsEnabled = true;
            return;
        }
    }

    // are we running any tests at all?
    if ( this.state.testsEnabled ) {
        // check for comment style (//dont do this. // do this)
        if ( hasComment(line) ) {
            if ( config.commentSpace || this.state.strictMode ) {
                if ( commentStyleCorrect(line) === false ) {
                    this.warnings.push( chalk.yellow('line comments require a space after //') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
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
                this.state.hash = true;
                return;
            }

            // if the above equals true we check for the end of the hash
            if ( hashEnding( line, this.state.hash ) ) {
                this.state.hash = false;
                return;
            }

            // check that commas are followed by a space
            if ( config.cssLiteral || this.state.strictMode ) {
                if ( cssLiteral(line) ) {
                    this.warnings.push( chalk.yellow('refrain from using css literals') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                    return;
                }
            }

            // check for brackets (except in hash)
            if ( config.brackets || this.state.strictMode ) {
                if ( brackets( line, this.state.hash ) && !this.state.cssBlock ) {
                    this.warnings.push( chalk.yellow('unecessary bracket') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check that commas are followed by a space
            if ( config.commaSpace || this.state.strictMode ) {
                if ( commaStyleCorrect(line) === false ) {
                    this.warnings.push( chalk.yellow('commas must be followed by a space for readability') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for extra spaces when using parens
            if ( config.mixinSpace || config.parenSpace || this.state.strictMode ) {
                if ( parenStyleCorrect(line) === false ) {
                    this.warnings.push( chalk.yellow('( $param1, $param2 ) is preferred over ($param1, $param2)') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for border none (prefer border 0)
            if ( config.borderNone || this.state.strictMode ) {
                if ( checkBorderNone(line) ) {
                    this.warnings.push( chalk.yellow('border 0 is preferred over border none') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for border none (prefer border 0)
            if ( config.leadingZero || this.state.strictMode ) {
                if ( leadingZero(line) ) {
                    this.warnings.push( chalk.yellow('leading zeros for decimal points are unecessary') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for @block when defining block var
            if ( config.enforceBlockStyle || this.state.strictMode ) {
                if ( blockStyleCorrect(line) === false ) {
                    this.warnings.push( chalk.yellow('block variables must include @block') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for @extend(s) preference
            if ( config.extendPref || this.state.strictMode ) {
                if ( this.state.strictMode && config.extendPref === false ) {
                    config.extendPref = '@extends';
                }

                if ( extendStyleCorrect(line, config.extendPref) === false ) {
                    this.warnings.push( chalk.yellow('please use the ' + config.extendPref + ' syntax when extending') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for naming convention preference
            if ( config.namingConvention || this.state.strictMode ) {
                if ( this.state.strictMode && config.namingConvention === false ) {
                    config.namingConvention = 'lowercase-dash';
                }

                if ( namingConvention(line, config.namingConvention) === false ) {
                    this.warnings.push( chalk.yellow('preferred naming convention is ' + config.namingConvention) + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // only extend placeholder vars (or not)
            if ( config.placeholders || this.state.strictMode ) {
                if ( placeholderStyleCorrect(line) === false ) {
                    this.warnings.push( chalk.yellow('please extend only placeholder vars') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for $ at start of var
            if ( config.enforceVarStyle || this.state.strictMode ) {
                if ( varStyleCorrect(line) === false ) {
                    this.warnings.push( chalk.yellow('variables must be prefixed with the $ sign.') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for * selector (* is discouraged)
            if ( config.universal || this.state.strictMode ) {
                if ( universalSelector(line) ) {
                    this.warnings.push( chalk.yellow('* selector is slow. Consider a different selector.') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for unecessary : (margin 0 is preferred over margin: 0)
            if ( config.colons || this.state.strictMode ) {
                if ( colon( line, this.state.hash ) ) {
                    this.warnings.push( chalk.yellow('unecessary colon found:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for unecessary ; (margin 0; is invalid)
            if ( config.semicolons || this.state.strictMode ) {
                if ( semicolon(line) ) {
                    this.warnings.push( chalk.yellow('unecessary semicolon found:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for places where we can be more efficient (margin 0 50px vs margin 0 50px 0 50px)
            if ( config.efficient || this.state.strictMode ) {
                if ( efficient( line, arr ) === false ) {
                    this.warnings.push( chalk.yellow('the value on this line could be more succinct:') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check mixed spaces and tabs
            if ( config.mixed || this.state.strictMode ) {
                // console.log( config.indentSpaces );
                // else check tabs against tabs and spaces against spaces
                if ( mixedSpacesAndTabs( line, config.indentSpaces ) ) {
                    this.warnings.push( chalk.yellow('mixed spaces and tabs') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }


            // check for trailing whitespace
            if ( config.trailingWhitespace || this.state.strictMode ) {
                if ( whitespace( line ) ) {
                    this.warnings.push( chalk.yellow('trailing whitespace') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check selector depth
            if ( config.depthLimit || this.state.strictMode ) {
                // else check tabs against tabs and spaces against spaces
                if ( tooMuchNest( line, arr, config.depthLimit, config.indentSpaces ) ) {
                    this.warnings.push( chalk.yellow('selector depth greater than', config.depthLimit + ':') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check valid properties and values
            if ( config.valid || this.state.strictMode ) {
                if ( validProperty( line, validCSS, validHTML ) === false ) {
                    this.warnings.push( chalk.yellow('property is not valid') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
                // if ( validValue( line, arr, validCSS, validHTML ) === false ) {
                //     this.warnings.push( chalk.yellow('value is not valid') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                // }
            }

            // check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
            if ( config.zeroUnits || config.unecessaryPx || this.state.strictMode ) {
                if ( zeroUnits(line) ) {
                    this.warnings.push( chalk.yellow('0 is preferred. Unit value is unnecessary') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
                }
            }

            // check for 0px (margin 0 is preferred over margin 0px | 0em | 0whatever)
            // if ( config.zIndexr || this.state.strictMode ) {
            //     if ( zIndexr(line, arr, config.zIndexr) ) {
            //         this.warnings.push( chalk.yellow('0 is preferred. Unit value is unnecessary') + '\nFile: ' + file + '\nLine: ' + num + ': ' + output );
            //     }
            // }
        }
    }
}