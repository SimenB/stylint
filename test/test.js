var assert = require('assert'),
    blockStyleCorrect       = require('../lib/checks/checkBlockStyle'),
    checkBorderNone         = require('../lib/checks/checkBorderNone'),
    colon                   = require('../lib/checks/checkForColon'),
    commaStyleCorrect       = require('../lib/checks/checkCommaStyle'),
    commentStyleCorrect     = require('../lib/checks/checkCommentStyle'),
    cssLiteral              = require('../lib/checks/checkForCssLiteral'),
    efficient               = require('../lib/checks/checkForEfficiency'),
    extendStyleCorrect      = require('../lib/checks/checkForExtendStyle'),
    hasComment              = require('../lib/checks/checkForComment'),
    hashEnding              = require('../lib/checks/checkForHashEnd'),
    hashStarting            = require('../lib/checks/checkForHashStart'),
    Lint                    = require('../index').Lint,
    leadingZero             = require('../lib/checks/checkForLeadingZero'),
    mixinStyleCorrect       = require('../lib/checks/checkForMixinStyle'),
    placeholderStyleCorrect = require('../lib/checks/checkForPlaceholderStyle'),
    pxStyleCorrect          = require('../lib/checks/checkForPx'),
    semicolon               = require('../lib/checks/checkForSemicolon'),
    should                  = require('should'),
    startsWithComment       = require('../lib/checks/checkForCommentStart'),
    tooMuchNest             = require('../lib/checks/checkNesting'),
    universalSelector       = require('../lib/checks/checkForUniversal'),
    varStyleCorrect         = require('../lib/checks/checkVarStyle');

describe('Linter Object Check: ', function() {

    describe('check read method', function() {
        it ('should return true if', function() {
            console.log( Lint );
            // assert.equal( false, blockStyleCorrect('myBlock = ') );
            // assert.equal( false, blockStyleCorrect('myBlock =') );
            // assert.equal( true, blockStyleCorrect('myBlock = @block') );
            // assert.equal( true, blockStyleCorrect('myBlock = @block ') );
            // assert.equal( undefined, blockStyleCorrect('margin 0') );
        });
    });
});

describe('Linter Style Checks: ', function() {

    describe('block style', function() {
        it ('should return false if block style incorrect or true if correct', function() {
            assert.equal( false, blockStyleCorrect('myBlock = ') );
            assert.equal( false, blockStyleCorrect('myBlock =') );
            assert.equal( true, blockStyleCorrect('myBlock = @block') );
            assert.equal( true, blockStyleCorrect('myBlock = @block ') );
            assert.equal( undefined, blockStyleCorrect('margin 0') );
        });
    });

    describe('border none', function() {
        it ('should return true if border none is present, else return false', function() {
            assert.equal( false, checkBorderNone('border 0') );
            assert.equal( true, checkBorderNone('border none') );
            assert.equal( undefined, checkBorderNone('margin 0') );
        });
    });

    describe('has comment', function() {
        it ('should return true if // is present anywhere on the line', function() {
            assert.equal( false, hasComment('.noCommentOnThisLine ') );
            assert.equal( true, hasComment('//test') );
            assert.equal( true, hasComment('margin 0 auto //test') );
            assert.equal( true, hasComment('margin 0 auto // test') );
            assert.equal( true, hasComment('// test') );
        });
    });

    describe('starts with comment', function() {
        it ('should return true if // is the first character on the line', function() {
            assert.equal( false, startsWithComment('margin 0 auto //test') );
            assert.equal( true, startsWithComment('//test') );
            assert.equal( true, startsWithComment(' // test') );
            assert.equal( undefined, startsWithComment('.noCommentOnThisLine ') );
        });
    });

    describe('comment style', function() {
        it ('should return true if line comment has space after it, false if not', function() {
            assert.equal( false, commentStyleCorrect('//test') );
            assert.equal( false, commentStyleCorrect('margin 0 auto //test') );
            assert.equal( true, commentStyleCorrect('margin 0 auto // test') );
            assert.equal( true, commentStyleCorrect('// test') );
            assert.equal( undefined, commentStyleCorrect('.noCommentOnThisLine') );
        });
    });

    describe('comma style', function() {
        it ('should return true if space after commas, false if not', function() {
            assert.equal( false, commaStyleCorrect('0,0, 0, .18') );
            assert.equal( true, commaStyleCorrect('0, 0, 0, .18') );
        });
    });

    describe('colon style', function() {
        it ('should return true if unecessary colon is found', function() {
            assert.equal( false, colon('margin 0 auto', false) );
            assert.equal( true, colon('margin: 0 auto', false) );
        });
    });

    describe('css literal', function() {
        it ('should return true if @css is used, false if not', function() {
            assert.equal( false, cssLiteral('not a css literal') );
            assert.equal( false, cssLiteral('@extends $placeholderVar') );
            assert.equal( true, cssLiteral('@css {') );
        });
    });

    describe('efficient', function() {
        it ('should return true if value is efficient, false if not', function() {
            assert.equal( false, efficient('margin 0 0 0 0') );
            assert.equal( false, efficient('margin 0 0 0') );
            assert.equal( false, efficient('margin 0 0') );
            assert.equal( undefined, efficient('margin 0') );
        });
    });

    describe('extends style', function() {
        it ('should return true if value matches preferred style', function() {
            assert.equal( false, extendStyleCorrect('@extend $placeHolderVar', '@extends') );
            assert.equal( false, extendStyleCorrect('@extends $placeHolderVar', '@extend') );
            assert.equal( true, extendStyleCorrect('@extend $placeHolderVar', '@extend') );
            assert.equal( true, extendStyleCorrect('@extends $placeHolderVar', '@extends') );
            assert.equal( undefined, extendStyleCorrect('margin 0') );
        });
    });

    describe('hash start', function() {
        it ('should return true if = and { are found on the same line', function() {
            assert.equal( false, hashStarting('$myVar =') );
            assert.equal( false, hashStarting('myVar = @block') );
            assert.equal( false, hashStarting('.mistakenUseOfBracket {') );
            assert.equal( false, hashStarting('margin 0') );
            assert.equal( true, hashStarting('myHash = {') );
        });
    });

    describe('hash end', function() {
        it ('should return true if 2nd param is set to true and } is found', function() {
            assert.equal( false, hashEnding('margin 0', true) );
            assert.equal( false, hashEnding('myHash = {', true) );
            assert.equal( false, hashEnding('margin 0', false) );
            assert.equal( false, hashEnding('myHash = {', false) );
            assert.equal( false, hashEnding('}', false) );
            assert.equal( true, hashEnding('}', true) );
            assert.equal( true, hashEnding('    }', true) );
        });
    });

    describe('leading zero', function() {
        it ('should return true line if line has a zero before a decimal point and not part of range', function() {
            assert.equal( true, leadingZero('color (0, 0, 0, 0.18)') );
            assert.equal( true, leadingZero('color (0,0,0,0.18)') );
            assert.equal( false, leadingZero('color (0, 0, 0, .18)') );
            assert.equal( false, leadingZero('color (0,0,0,.18)') );
            assert.equal( false, leadingZero('for $ in (0..9)') );
        });
    });

    describe('mixin style', function() {
        it ('should return true if extra spaces are found, false if not', function() {
            assert.equal( false, mixinStyleCorrect('myMixin(param1, param2)') );
            assert.equal( true, mixinStyleCorrect('myMixin( param1, param2 )') );
            assert.equal( undefined, mixinStyleCorrect('.notAMixin ') );
        });
    });

    describe('nesting', function() {
        it ('should return true if more indents than 2nd param', function() {
            assert.equal( false, tooMuchNest('margin 0', 4, 4) );
            assert.equal( false, tooMuchNest('			margin 0', 4, 4) );
            assert.equal( true, tooMuchNest('          margin 0', 1, 4) );
            assert.equal( true, tooMuchNest('       margin 0', 2, 2) );
            assert.equal( true, tooMuchNest('                   margin 0 )', 4, 4) );
            assert.equal( true, tooMuchNest('					margin 0 )', 4, false) );
            assert.equal( true, tooMuchNest('		margin 0 )', 1, false) );
        });
    });

    describe('unecessary px', function() {
        it ('should return false if 0px is found', function() {
            assert.equal( false, pxStyleCorrect('margin 0px') );
            assert.equal( true, pxStyleCorrect('margin 0') );
        });
    });

    describe('placeholder style', function() {
        it ('should return true if placeholder var is used, false if not', function() {
            assert.equal( false, placeholderStyleCorrect('@extends .notPlaceholderVar') );
            assert.equal( true, placeholderStyleCorrect('@extends $placeholderVar') );
            assert.equal( undefined, placeholderStyleCorrect('margin 0') );
        });
    });

    describe('semicolon', function() {
        it ('should return true if semicolon is found', function() {
            assert.equal( false, semicolon('margin 0 auto') );
            assert.equal( true, semicolon('margin 0 auto;') );
        });
    });

    describe('universal selector', function() {
        it ('should return true if * is found', function() {
            assert.equal( false, universalSelector('img') );
            assert.equal( true, universalSelector('*') );
            assert.equal( true, universalSelector('*:before') );
        });
    });

    /**
     * would like to have this be smarter
     * ideally it would know whether or not a $ should be used based on context
     * right now it just checks if $ is used when defining a var and thats it
     */
    describe('var style check for find vars that dont have $ in front of them', function() {
        it ('should return true if $ is found, false if not', function() {
            assert.equal( false, varStyleCorrect('myVar = 0') );
            assert.equal( true, varStyleCorrect('$myVar = 0') );
            assert.equal( true, varStyleCorrect('$first-value = floor( (100% / $columns) * $index )') );
            assert.equal( undefined, varStyleCorrect('define-my-mixin( $myParam )') );
            assert.equal( undefined, varStyleCorrect('if($myParam == true)') );
            assert.equal( undefined, varStyleCorrect('.notAVar') );
            assert.equal( undefined, varStyleCorrect('if(myParam == true)') );
            assert.equal( undefined, varStyleCorrect('define-my-mixin( myParam )') );
            assert.equal( undefined, varStyleCorrect('  use-my-mixin( myParam )') );
            assert.equal( undefined, varStyleCorrect('  if( $myParam )') );
        });
    });
});