const
	assert                  = require('assert'),
    fs                      = require('fs'),
    blockStyleCorrect       = require('../src/checks/checkBlockStyle'),
    brackets				= require('../src/checks/checkForBrackets'),
    checkBorderNone         = require('../src/checks/checkBorderNone'),
    colon                   = require('../src/checks/checkForColon'),
    commaStyleCorrect       = require('../src/checks/checkCommaStyle'),
    commentStyleCorrect     = require('../src/checks/checkCommentStyle'),
    cssLiteral              = require('../src/checks/checkForCssLiteral'),
    efficient               = require('../src/checks/checkForEfficiency'),
    extendStyleCorrect      = require('../src/checks/checkForExtendStyle'),
    hasComment              = require('../src/checks/checkForComment'),
    hashEnding              = require('../src/checks/checkForHashEnd'),
    hashStarting            = require('../src/checks/checkForHashStart'),
    // init					= require('../src/init'),
    leadingZero             = require('../src/checks/checkForLeadingZero'),
    mixedSpacesOrTabs       = require('../src/checks/checkForMixedSpacesTabs'),
    namingConvention		= require('../src/checks/checkNamingConvention'),
    parenStyleCorrect       = require('../src/checks/checkForParenStyle'),
    placeholderStyleCorrect = require('../src/checks/checkForPlaceholderStyle'),
    // read                    = require('../src/read'),
    semicolon               = require('../src/checks/checkForSemicolon'),
    should                  = require('should'),
    startsWithComment       = require('../src/checks/checkForCommentStart'),
    tooMuchNest             = require('../src/checks/checkNesting'),
    universalSelector       = require('../src/checks/checkForUniversal'),
    whitespace				= require('../src/checks/checkForTrailingWhitespace'),
    validProperty           = require('../src/checks/checkForValidProperties'),
    varStyleCorrect         = require('../src/checks/checkVarStyle'),
    zeroUnits				= require('../src/checks/checkForZeroUnits'),
    validCSS = JSON.parse( fs.readFileSync('./src/checks/validCSS.json') ),
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

// console.log( init( 'nothing' ) );

// describe('Core Functionality: ', function() {

// 	// describe('Init: ', function() {
//  //        it('should be a function', function() {
//  //            init.should.be.an.instanceOf(Function);
//  //        });
//  //        it('should throw an error if 1st param not defined', function() {
//  //            init.should.throw('Dir or filename not defined');
//  //        });
// 	// });

//     // describe('Read: ', function() {
//     //     it('should be a function', function() {
//     //         read.should.be.an.instanceOf(Function);
//     //     });
//     //     it('should throw an error if 1st param not defined', function() {
//     //         read.should.throw('Files or file (lintMe) not defined');
//     //     });
//     //     it('should throw an error if 2nd param not defined', function() {
//     //         read('filename').should.throw('No config file passed in');
//     //     });
//     // });
// });

describe('Linter Style Checks: ', function() {

    describe('block style', function() {
        it ('should return false if block style incorrect or true if correct', function() {
            assert.equal( false, blockStyleCorrect('myBlock = ') );
            assert.equal( false, blockStyleCorrect('myBlock =') );
            assert.equal( true, blockStyleCorrect('myBlock = @block') );
            assert.equal( true, blockStyleCorrect('myBlock = @block ') );
            assert.equal( undefined, blockStyleCorrect('margin 0') );
            assert.equal( undefined, blockStyleCorrect('myHash = {') );
            assert.equal( undefined, blockStyleCorrect() );
        });
    });

    describe('border none', function() {
        it ('should return true if border none is present, else return false', function() {
            assert.equal( false, checkBorderNone('border 0') );
            assert.equal( true, checkBorderNone('border none') );
            assert.equal( undefined, checkBorderNone('margin 0') );
            assert.equal( undefined, checkBorderNone() );
        });
    });

    // 2nd param being passed in here determines if we're in a hash or not (true means hash)
    describe('brackets', function() {
        it ('should return true if illegal bracket found on line (not interpolation, not hash)', function() {
            assert.equal( false, brackets('}', true) );
            assert.equal( false, brackets('{interpolation}', true) );
            assert.equal( false, brackets('{interpolation}', false) );
            assert.equal( false, brackets('.class-name-with-{i}', false) );
            assert.equal( false, brackets('.class-name-with-{i}', true) );
            assert.equal( true, brackets('.className {', false) );
            assert.equal( true, brackets('.className {', true) );
            assert.equal( true, brackets('}', false) );
            assert.equal( undefined, brackets('.className ', true) );
            assert.equal( undefined, brackets('.className ', false) );
            assert.equal( undefined, brackets('}', undefined) );
            assert.equal( undefined, brackets(undefined, false) );
            assert.equal( undefined, brackets(undefined, true) );
            assert.equal( undefined, brackets() );
        });
    });

    describe('has comment', function() {
        it ('should return true if // is present anywhere on the line', function() {
            assert.equal( false, hasComment('.noCommentOnThisLine ') );
            assert.equal( true, hasComment('//test') );
            assert.equal( true, hasComment('margin 0 auto //test') );
            assert.equal( true, hasComment('margin 0 auto // test') );
            assert.equal( true, hasComment('// test') );
            assert.equal( undefined, hasComment() );
        });
    });

    describe('starts with comment', function() {
        it ('should return true if // is the first character on the line', function() {
            assert.equal( false, startsWithComment('margin 0 auto //test') );
            assert.equal( true, startsWithComment('//test') );
            assert.equal( true, startsWithComment(' // test') );
            assert.equal( undefined, startsWithComment('.noCommentOnThisLine ') );
            assert.equal( undefined, startsWithComment() );
        });
    });

    describe('comment style', function() {
        it ('should return true if line comment has space after it, false if not', function() {
            assert.equal( false, commentStyleCorrect('//test') );
            assert.equal( false, commentStyleCorrect('margin 0 auto //test') );
            assert.equal( true, commentStyleCorrect('margin 0 auto // test') );
            assert.equal( true, commentStyleCorrect('// test') );
            assert.equal( undefined, commentStyleCorrect('.noCommentOnThisLine') );
            assert.equal( undefined, commentStyleCorrect() );
        });
    });

    describe('comma style', function() {
        it ('should return true if space after commas, false if not', function() {
            assert.equal( false, commaStyleCorrect('0,0, 0, .18') );
            assert.equal( true, commaStyleCorrect('0, 0, 0, .18') );
            assert.equal( undefined, commaStyleCorrect('.no-need-for-comma') );
            assert.equal( undefined, commaStyleCorrect() );
        });
    });

    describe('colon style', function() {
        it ('should return true if unecessary colon is found', function() {
            assert.equal( false, colon('margin 0 auto', false) );
            assert.equal( true, colon('margin: 0 auto', false) );
            assert.equal( undefined, colon('margin: 0 auto') );
            assert.equal( undefined, colon() );
            assert.equal( undefined, colon(undefined, false) );
            assert.equal( undefined, colon(undefined, true) );
        });
    });

    describe('css literal', function() {
        it ('should return true if @css is used, false if not', function() {
            assert.equal( false, cssLiteral('not a css literal') );
            assert.equal( false, cssLiteral('@extends $placeholderVar') );
            assert.equal( true, cssLiteral('@css {') );
            assert.equal( undefined, cssLiteral() );
        });
    });

    describe('efficient', function() {
        var test1 = 'margin 0 0 0 0',
            test2 = 'margin 0 0 0',
            test3 = 'margin 0 0',
            test4 = 'margin 0 5px 0 5px',
            test5 = 'margin 5px 0 5px',
            test6 = 'margin 5px 0 5px 0',
            test7 = 'margin 0 5px 0',
            test8 = 'margin 0 5px',
            test9 = 'margin 5px 0',
            test10 = 'margin 5px 0 0',
            test11 = 'margin 0',
            test12 = 'margin 5px',
            test13 = '.not-margin-or-padding';

        it ('should return true if value is efficient, false if not', function() {
            assert.equal( false, efficient( test1, test1.split(' ') ) );
            assert.equal( false, efficient( test2, test2.split(' ') ) );
            assert.equal( false, efficient( test3, test3.split(' ') ) );
            assert.equal( false, efficient( test4, test4.split(' ') ) );
            assert.equal( false, efficient( test5, test5.split(' ') ) );
            assert.equal( false, efficient( test6, test6.split(' ') ) );
            assert.equal( false, efficient( test7, test7.split(' ') ) );
            assert.equal( true, efficient( test8, test8.split(' ') ) );
            assert.equal( true, efficient( test9, test9.split(' ') ) );
            assert.equal( true, efficient( test10, test10.split(' ') ) );
            assert.equal( true, efficient( test11, test11.split(' ') ) );
            assert.equal( true, efficient( test12, test12.split(' ') ) );
            assert.equal( undefined, efficient( test13, test13.split(' ') ) );
            assert.equal( undefined, efficient() );
        });
    });

    describe('extends style', function() {
        it ('should return true if value matches preferred style', function() {
            assert.equal( false, extendStyleCorrect('@extend $placeHolderVar', '@extends') );
            assert.equal( false, extendStyleCorrect('@extends $placeHolderVar', '@extend') );
            assert.equal( true, extendStyleCorrect('@extend $placeHolderVar', '@extend') );
            assert.equal( true, extendStyleCorrect('@extends $placeHolderVar', '@extends') );
            assert.equal( undefined, extendStyleCorrect('@extends $placeHolderVar') );
            assert.equal( undefined, extendStyleCorrect() );
            assert.equal( undefined, extendStyleCorrect(undefined, '@extends') );
        });
    });

    describe('hash start', function() {
        it ('should return true if = and { are found on the same line', function() {
            assert.equal( false, hashStarting('$myVar =') );
            assert.equal( false, hashStarting('myVar = @block') );
            assert.equal( false, hashStarting('.mistakenUseOfBracket {') );
            assert.equal( false, hashStarting('margin 0') );
            assert.equal( true, hashStarting('myHash = {') );
            assert.equal( undefined, hashStarting() );
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
            assert.equal( undefined, hashEnding('}') );
            assert.equal( undefined, hashEnding() );
        });
    });

    describe('leading zero', function() {
        it ('should return true line if line has a zero before a decimal point and not part of range', function() {
            assert.equal( true, leadingZero('color (0, 0, 0, 0.18)') );
            assert.equal( true, leadingZero('color (0,0,0,0.18)') );
            assert.equal( false, leadingZero('color (0, 0, 0, .18)') );
            assert.equal( false, leadingZero('color (0,0,0,.18)') );
            assert.equal( false, leadingZero('for $ in (0..9)') );
            assert.equal( undefined, leadingZero() );
        });
    });

    describe('mixed spaces and tabs', function() {
        it ('should return true if spaces and tabs are mixed, false if not', function() {
            assert.equal( false, mixedSpacesOrTabs('    margin 0', 4) );
            assert.equal( false, mixedSpacesOrTabs('	margin 0', false) );
            assert.equal( true, mixedSpacesOrTabs('		margin 0', 4) );
            assert.equal( true, mixedSpacesOrTabs('	 	 margin 0', false) );
            assert.equal( true, mixedSpacesOrTabs('		padding 0em', 4) );
            assert.equal( undefined, mixedSpacesOrTabs() );
        });
    });

    describe('naming convention', function() {
        it ('should return true if correct naming convention, false if not, undefined if line not checkable', function() {
            assert.equal( true, namingConvention('$var-name-like-this =', 'lowercase-dash') );
            assert.equal( true, namingConvention('.class-name-like-this', 'lowercase-dash') );
            assert.equal( true, namingConvention('#id-name-like-this', 'lowercase-dash') );

            assert.equal( true, namingConvention('$var_name_like_this =', 'lowercase_underscore') );
            assert.equal( true, namingConvention('.class_name_like_this', 'lowercase_underscore') );
            assert.equal( true, namingConvention('#id_name_like_this', 'lowercase_underscore') );

            assert.equal( true, namingConvention('$varNameLikeThis =', 'camelCase') );
            assert.equal( true, namingConvention('.classNameLikeThis', 'camelCase') );
            assert.equal( true, namingConvention('#idNameLikeThis', 'camelCase') );

            assert.equal( false, namingConvention('$var_name_like_this =', 'lowercase-dash') );
            assert.equal( false, namingConvention('.class_name_like_this', 'lowercase-dash') );
            assert.equal( false, namingConvention('#id_name_like_this', 'lowercase-dash') );

            assert.equal( false, namingConvention('$var-name-like-this =', 'lowercase_underscore') );
            assert.equal( false, namingConvention('.class-name-like-this', 'lowercase_underscore') );
            assert.equal( false, namingConvention('#id-name-like-this', 'lowercase_underscore') );

            assert.equal( false, namingConvention('$var-name-like-this =', 'camelCase') );
            assert.equal( false, namingConvention('.class-name-like-this', 'camelCase') );
            assert.equal( false, namingConvention('#id-name-like-this', 'camelCase') );

            assert.equal( undefined, namingConvention('$var_name_like_this =', false) );
            assert.equal( undefined, namingConvention('.class_name_like_this', false) );
            assert.equal( undefined, namingConvention('#id_name_like_this', false) );
            assert.equal( undefined, namingConvention('$var-name-like-this =', false) );
            assert.equal( undefined, namingConvention('.class-name-like-this', false) );
            assert.equal( undefined, namingConvention('#id-name-like-this', false) );
            assert.equal( undefined, namingConvention('$var-name-like-this =', false) );
            assert.equal( undefined, namingConvention('.class-name-like-this', false) );
            assert.equal( undefined, namingConvention('#id-name-like-this', false) );
            assert.equal( undefined, namingConvention('margin 0', false) );
            assert.equal( undefined, namingConvention('margin 0', 'lowercase-dash') );
            assert.equal( undefined, namingConvention('padding inherit', 'camelCase') );
            assert.equal( undefined, namingConvention('body ', 'lowercase-underscore') );
            assert.equal( undefined, namingConvention() );
            assert.equal( undefined, namingConvention('.className') );
        });
    });

	describe('nesting', function() {
        var test1 = 'margin 0',
            test2 = '			margin 0',
            test3 = '          margin 0',
            test4 = '       margin 0',
            test5 = '                   margin 0',
            test6 = '					margin 0',
            test7 = '		margin 0 )',
            test8 = '       margin 0 )';

	    it ('should return true if more indents than 2nd param', function() {
	        assert.equal( false, tooMuchNest( test1, test1.split(' '), 4, 4 ) );
	        assert.equal( false, tooMuchNest( test2, test2.split(' '), 4, 4 ) );
	        assert.equal( true, tooMuchNest( test3, test3.split(' '), 1, 4 ) );
	        assert.equal( true, tooMuchNest( test4, test4.split(' '), 2, 2 ) );
	        assert.equal( true, tooMuchNest( test5, test5.split(' '), 4, 4 ) );
	        assert.equal( true, tooMuchNest( test6, test6.split(' '), 4, false ) );
	        assert.equal( true, tooMuchNest( test7, test7.split(' '), 1, false ) );
            assert.equal( undefined, tooMuchNest( test8, test8.split(' '), undefined, false ) );
            assert.equal( undefined, tooMuchNest( test8, test8.split(' '), undefined, 4 ) );
            assert.equal( undefined, tooMuchNest( test8, test8.split(' '), undefined, undefined ) );
            assert.equal( undefined, tooMuchNest( test8, test8.split(' '), 4, undefined ) );
            assert.equal( undefined, tooMuchNest( undefined, undefined, 4, undefined ) );
            assert.equal( undefined, tooMuchNest() );
	    });
	});

    describe('paren style', function() {
        it ('should return true if extra spaces are found, false if not', function() {
            assert.equal( false, parenStyleCorrect('myMixin(param1, param2)') );
            assert.equal( true, parenStyleCorrect('myMixin( param1, param2 )') );
            assert.equal( undefined, parenStyleCorrect('.notAMixin ') );
            assert.equal( undefined, parenStyleCorrect() );
        });
    });

    describe('placeholder style', function() {
        it ('should return true if placeholder var is used, false if not', function() {
            assert.equal( false, placeholderStyleCorrect('@extends .notPlaceholderVar') );
            assert.equal( true, placeholderStyleCorrect('@extends $placeholderVar') );
            assert.equal( undefined, placeholderStyleCorrect('margin 0') );
            assert.equal( undefined, placeholderStyleCorrect() );
        });
    });

    describe('semicolon', function() {
        it ('should return true if semicolon is found', function() {
            assert.equal( false, semicolon('margin 0 auto') );
            assert.equal( true, semicolon('margin 0 auto;') );
            assert.equal( undefined, semicolon() );
        });
    });

    describe('trailing whitespace', function() {
        it ('should return true if whitespace found', function() {
            assert.equal( true, whitespace('margin 0 auto	') );
            assert.equal( true, whitespace('margin 0 auto ') );
            assert.equal( false, whitespace('margin 0 auto') );
            assert.equal( undefined, whitespace() );
        });
    });

    describe('universal selector', function() {
        it ('should return true if * is found', function() {
            assert.equal( false, universalSelector('img') );
            assert.equal( true, universalSelector('*') );
            assert.equal( true, universalSelector('*:before') );
            assert.equal( undefined, universalSelector() );
        });
    });

    describe('valid property', function() {
        it ('should return true if property is valid, false if not', function() {
            assert.equal( false, validProperty( 'marg 0 auto', validCSS, validHTML ) );
            assert.equal( false, validProperty( 'pad 0', validCSS, validHTML ) );
            assert.equal( true, validProperty( 'padding 0', validCSS, validHTML ) );
            assert.equal( true, validProperty( 'input', validCSS, validHTML ) );
            assert.equal( true, validProperty( 'body', validCSS, validHTML ) );
            assert.equal( true, validProperty( '$var-name = ', validCSS, validHTML ) );
            assert.equal( true, validProperty( '{var-name}', validCSS, validHTML ) );
            assert.equal( true, validProperty( 'my-hash = {', validCSS, validHTML ) );
            assert.equal( true, validProperty( 'for i in 0..9', validCSS, validHTML ) );
            assert.equal( undefined, validProperty( undefined, validCSS, validHTML ) );
            assert.equal( undefined, validProperty( 'body', undefined, validHTML ) );
            assert.equal( undefined, validProperty( 'body', validCSS, undefined ) );
        });
    });

    /**
     * would like to have this be smarter
     * ideally it would know whether or not a $ should be used based on context
     * right now it just checks if $ is used when defining a var and thats it
     */
    describe('var style check', function() {
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
            assert.equal( undefined, varStyleCorrect() );
        });
    });

    describe('zero units', function() {
        it ('should return true if 0 + any unit type is found (0 is preferred)', function() {
            assert.equal( true, zeroUnits('margin 0px') );
            assert.equal( true, zeroUnits('margin 0em') );
            assert.equal( true, zeroUnits('margin 0%') );
            assert.equal( true, zeroUnits('margin 0rem') );
            assert.equal( true, zeroUnits('margin 0pt') );
            assert.equal( true, zeroUnits('margin 0pc') );
            assert.equal( true, zeroUnits('margin 0vh') );
            assert.equal( true, zeroUnits('margin 0vw') );
            assert.equal( true, zeroUnits('margin 0vmin') );
            assert.equal( true, zeroUnits('margin 0vmax') );
            assert.equal( true, zeroUnits('margin 0mm') );
            assert.equal( true, zeroUnits('margin 0cm') );
            assert.equal( true, zeroUnits('margin 0in') );
            assert.equal( true, zeroUnits('margin 0mozmm') );
            assert.equal( true, zeroUnits('margin 0ex') );
            assert.equal( true, zeroUnits('margin 0ch') );
            assert.equal( false, zeroUnits('margin 0') );
            assert.equal( undefined, zeroUnits() );
        });
    });

});