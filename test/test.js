var assert = require('assert'),
    blockStyleCorrect       = require('../lib/checkBlockStyle'),
    checkBorderNone         = require('../lib/checkBorderNone'),
    colon                   = require('../lib/checkForColon'),
    commaStyleCorrect       = require('../lib/checkCommaStyle'),
    commentStyleCorrect     = require('../lib/checkCommentStyle'),
    cssLiteral              = require('../lib/checkForCssLiteral'),
    efficient               = require('../lib/checkForEfficiency'),
    extendStyleCorrect      = require('../lib/checkForExtendStyle'),
    hasComment              = require('../lib/checkForComment'),
    hashEnding              = require('../lib/checkForHashEnd'),
    hashStarting            = require('../lib/checkForHashStart'),
    Lint                    = require('../index').Lint,
    mixinStyleCorrect       = require('../lib/checkForMixinStyle'),
    placeholderStyleCorrect = require('../lib/checkForPlaceholderStyle'),
    pxStyleCorrect          = require('../lib/checkForPx'),
    semicolon               = require('../lib/checkForSemicolon'),
    should                  = require('should'),
    startsWithComment       = require('../lib/checkForCommentStart'),
    tooMuchNest             = require('../lib/checkNesting'),
    universalSelector       = require('../lib/checkForUniversal'),
    varStyleCorrect         = require('../lib/checkVarStyle');


describe('linter style checks', function() {

    describe('block style check should find @block when defining block vars', function() {
        it ('should return false if block style incorrect or true if correct', function() {
            assert.equal( false, blockStyleCorrect('myBlock = ') );
            assert.equal( false, blockStyleCorrect('myBlock =') );
            assert.equal( true, blockStyleCorrect('myBlock = @block') );
            assert.equal( true, blockStyleCorrect('myBlock = @block ') );
            assert.equal( undefined, blockStyleCorrect('margin 0') );
        });
    });

    describe('border none check should find border none (border 0 preferred)', function() {
        it ('should return true if border none is present, else return false', function() {
            assert.equal( false, checkBorderNone('border 0') );
            assert.equal( true, checkBorderNone('border none') );
            assert.equal( undefined, checkBorderNone('margin 0') );
        });
    });

    describe('comment check just checks for existence of a line comment', function() {
        it ('should return true if // is present anywhere on the line', function() {
            assert.equal( false, hasComment('.noCommentOnThisLine ') );
            assert.equal( true, hasComment('//test') );
            assert.equal( true, hasComment('margin 0 auto //test') );
            assert.equal( true, hasComment('margin 0 auto // test') );
            assert.equal( true, hasComment('// test') );
        });
    });

    describe('starts with comment check just checks if line starts with comment', function() {
        it ('should return true if // is the first character on the line', function() {
            assert.equal( false, startsWithComment('margin 0 auto //test') );
            assert.equal( true, startsWithComment('//test') );
            assert.equal( true, startsWithComment(' // test') );
            assert.equal( undefined, startsWithComment('.noCommentOnThisLine ') );
        });
    });

    describe('comment style check should check for space after line comments', function() {
        it ('should return false if comment style incorrect or true if correct', function() {
            assert.equal( false, commentStyleCorrect('//test') );
            assert.equal( false, commentStyleCorrect('margin 0 auto //test') );
            assert.equal( true, commentStyleCorrect('margin 0 auto // test') );
            assert.equal( true, commentStyleCorrect('// test') );
            assert.equal( undefined, commentStyleCorrect('.noCommentOnThisLine') );
        });
    });

    describe('comma style check should check for space after commas', function() {
        it ('should return false if comma style incorrect or true if correct', function() {
            assert.equal( false, commaStyleCorrect('0,0, 0, .18') );
            assert.equal( true, commaStyleCorrect('0, 0, 0, .18') );
        });
    });

    describe('colon style check should check unecessary colons', function() {
        it ('should return true if colon is found', function() {
            assert.equal( false, colon('margin 0 auto', false) );
            assert.equal( true, colon('margin: 0 auto', false) );
        });
    });

    describe('css literal check should find use of @css blocks', function() {
        it ('should return true if @css is used, false if not', function() {
            assert.equal( false, cssLiteral('not a css literal') );
            assert.equal( false, cssLiteral('@extends $placeholderVar') );
            assert.equal( true, cssLiteral('@css {') );
        });
    });

    describe('efficient check should find places where values could be more succinct', function() {
        it ('should return true if value is efficient, false if not', function() {
            assert.equal( false, efficient('margin 0 0 0 0') );
            assert.equal( false, efficient('margin 0 0 0') );
            assert.equal( false, efficient('margin 0 0') );
            assert.equal( undefined, efficient('margin 0') );
        });
    });

    describe('extend check should find @extend or @extends and check against preferred style', function() {
        it ('should return true if value matches preferred style', function() {
            assert.equal( false, extendStyleCorrect('@extend $placeHolderVar', '@extends') );
            assert.equal( false, extendStyleCorrect('@extends $placeHolderVar', '@extend') );
            assert.equal( true, extendStyleCorrect('@extend $placeHolderVar', '@extend') );
            assert.equal( true, extendStyleCorrect('@extends $placeHolderVar', '@extends') );
            assert.equal( undefined, extendStyleCorrect('margin 0') );
        });
    });

    describe('hash start check should find the start of a hash, where colons are required', function() {
        it ('should return true if = and { are found on the same line', function() {
            assert.equal( false, hashStarting('$myVar =') );
            assert.equal( false, hashStarting('myVar = @block') );
            assert.equal( false, hashStarting('.mistakenUseOfBracket {') );
            assert.equal( false, hashStarting('margin 0') );
            assert.equal( true, hashStarting('myHash = {') );
        });
    });

    describe('hash end check should find the end of a hash, where colons are required', function() {
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

    describe('mixin style check should find places where spaces could be added to mixins for readability', function() {
        it ('should return true if extra spaces are found, false if not', function() {
            assert.equal( false, mixinStyleCorrect('myMixin(param1, param2)') );
            assert.equal( true, mixinStyleCorrect('myMixin( param1, param2 )') );
            assert.equal( undefined, mixinStyleCorrect('.notAMixin ') );
        });
    });

    describe('nesting check should count indents and warn if too many', function() {
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

    describe('pixel style check should check unecessary px following 0 values', function() {
        it ('should return false if 0px is found', function() {
            assert.equal( false, pxStyleCorrect('margin 0px') );
            assert.equal( true, pxStyleCorrect('margin 0') );
        });
    });

    describe('placeholder style check should check for use of placeholder vars when extending', function() {
        it ('should return true if placeholder var is used, false if not', function() {
            assert.equal( false, placeholderStyleCorrect('@extends .notPlaceholderVar') );
            assert.equal( true, placeholderStyleCorrect('@extends $placeholderVar') );
            assert.equal( undefined, placeholderStyleCorrect('margin 0') );
        });
    });

    describe('semicolon style check should find unecessary semicolons', function() {
        it ('should return true if semicolon is found', function() {
            assert.equal( false, semicolon('margin 0 auto') );
            assert.equal( true, semicolon('margin 0 auto;') );
        });
    });

    describe('universal selector check should find (usually) unecessary * selectors', function() {
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