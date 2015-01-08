const
	assert = require('assert'),
    should = require('should'),
    app = require('../index');

describe('Core Functionality: ', function() {

    // describe('State: dir', function() {
    //     it('should be either process.argv[2] or process.cwd()', function() {
    //         assert.equal( process.argv[2] | process.cwd(), app.state.dir );
    //     })
    // })

    describe('Read: ', function() {
        it('should be a function', function() {
            app.read.should.be.an.type( 'function' );
        });
    });
});

describe('Linter Style Checks: ', function() {

    describe('block style', function() {
        it ('should return false if block style incorrect or true if correct', function() {
            assert.equal( false, app.blockStyleCorrect('myBlock = ') );
            assert.equal( false, app.blockStyleCorrect('myBlock =') );
            assert.equal( true, app.blockStyleCorrect('myBlock = @block') );
            assert.equal( true, app.blockStyleCorrect('myBlock = @block ') );
            assert.equal( undefined, app.blockStyleCorrect('margin 0') );
            assert.equal( undefined, app.blockStyleCorrect('myHash = {') );
            assert.equal( undefined, app.blockStyleCorrect() );
        });
    });

    describe('border none', function() {
        it ('should return true if border none is present, else return false', function() {
            assert.equal( false, app.checkBorderNone('border 0') );
            assert.equal( true, app.checkBorderNone('border none') );
            assert.equal( undefined, app.checkBorderNone('margin 0') );
            assert.equal( undefined, app.checkBorderNone() );
        });
    });

    // 2nd param being passed in here determines if we're in a hash or not (true means hash)
    describe('brackets', function() {
        it ('should return true if illegal bracket found on line (not interpolation, not hash)', function() {
            assert.equal( false, app.brackets('}', true) );
            assert.equal( false, app.brackets('{interpolation}', true) );
            assert.equal( false, app.brackets('{interpolation}', false) );
            assert.equal( false, app.brackets('.class-name-with-{i}', false) );
            assert.equal( false, app.brackets('.class-name-with-{i}', true) );
            assert.equal( true, app.brackets('.className {', false) );
            assert.equal( true, app.brackets('.className {', true) );
            assert.equal( true, app.brackets('}', false) );
            assert.equal( undefined, app.brackets('.className ', true) );
            assert.equal( undefined, app.brackets('.className ', false) );
            assert.equal( undefined, app.brackets('}', undefined) );
            assert.equal( undefined, app.brackets(undefined, false) );
            assert.equal( undefined, app.brackets(undefined, true) );
            assert.equal( undefined, app.brackets() );
        });
    });

    describe('has comment', function() {
        it ('should return true if // is present anywhere on the line', function() {
            assert.equal( false, app.hasComment('.noCommentOnThisLine ') );
            assert.equal( true, app.hasComment('//test') );
            assert.equal( true, app.hasComment('margin 0 auto //test') );
            assert.equal( true, app.hasComment('margin 0 auto // test') );
            assert.equal( true, app.hasComment('// test') );
            assert.equal( undefined, app.hasComment() );
        });
    });

    describe('starts with comment', function() {
        it ('should return true if // is the first character on the line', function() {
            assert.equal( false, app.startsWithComment('margin 0 auto //test') );
            assert.equal( true, app.startsWithComment('//test') );
            assert.equal( true, app.startsWithComment(' // test') );
            assert.equal( undefined, app.startsWithComment('.noCommentOnThisLine ') );
            assert.equal( undefined, app.startsWithComment() );
        });
    });

    describe('comment style', function() {
        it ('should return true if line comment has space after it, false if not', function() {
            assert.equal( false, app.commentStyleCorrect('//test') );
            assert.equal( false, app.commentStyleCorrect('margin 0 auto //test') );
            assert.equal( true, app.commentStyleCorrect('margin 0 auto // test') );
            assert.equal( true, app.commentStyleCorrect('// test') );
            assert.equal( undefined, app.commentStyleCorrect('.noCommentOnThisLine') );
            assert.equal( undefined, app.commentStyleCorrect() );
        });
    });

    describe('comma style', function() {
        it ('should return true if space after commas, false if not', function() {
            assert.equal( false, app.commaStyleCorrect('0,0, 0, .18') );
            assert.equal( true, app.commaStyleCorrect('0, 0, 0, .18') );
            assert.equal( undefined, app.commaStyleCorrect('.no-need-for-comma') );
            assert.equal( undefined, app.commaStyleCorrect() );
        });
    });

    describe('colon style', function() {
        it ('should return true if unecessary colon is found', function() {
            assert.equal( false, app.colon('margin 0 auto', false) );
            assert.equal( true, app.colon('margin: 0 auto', false) );
            assert.equal( undefined, app.colon('margin: 0 auto') );
            assert.equal( undefined, app.colon() );
            assert.equal( undefined, app.colon(undefined, false) );
            assert.equal( undefined, app.colon(undefined, true) );
        });
    });

    describe('css literal', function() {
        it ('should return true if @css is used, false if not', function() {
            assert.equal( false, app.cssLiteral('not a css literal') );
            assert.equal( false, app.cssLiteral('@extends $placeholderVar') );
            assert.equal( true, app.cssLiteral('@css {') );
            assert.equal( undefined, app.cssLiteral() );
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
            assert.equal( false, app.efficient( test1, test1.split(' ') ) );
            assert.equal( false, app.efficient( test2, test2.split(' ') ) );
            assert.equal( false, app.efficient( test3, test3.split(' ') ) );
            assert.equal( false, app.efficient( test4, test4.split(' ') ) );
            assert.equal( false, app.efficient( test5, test5.split(' ') ) );
            assert.equal( false, app.efficient( test6, test6.split(' ') ) );
            assert.equal( false, app.efficient( test7, test7.split(' ') ) );
            assert.equal( true, app.efficient( test8, test8.split(' ') ) );
            assert.equal( true, app.efficient( test9, test9.split(' ') ) );
            assert.equal( true, app.efficient( test10, test10.split(' ') ) );
            assert.equal( true, app.efficient( test11, test11.split(' ') ) );
            assert.equal( true, app.efficient( test12, test12.split(' ') ) );
            assert.equal( undefined, app.efficient( test13, test13.split(' ') ) );
            assert.equal( undefined, app.efficient() );
        });
    });

    describe('extends style', function() {
        it ('should return true if value matches preferred style', function() {
            assert.equal( false, app.extendStyleCorrect('@extend $placeHolderVar', '@extends') );
            assert.equal( false, app.extendStyleCorrect('@extends $placeHolderVar', '@extend') );
            assert.equal( true, app.extendStyleCorrect('@extend $placeHolderVar', '@extend') );
            assert.equal( true, app.extendStyleCorrect('@extends $placeHolderVar', '@extends') );
            assert.equal( undefined, app.extendStyleCorrect('@extends $placeHolderVar') );
            assert.equal( undefined, app.extendStyleCorrect() );
            assert.equal( undefined, app.extendStyleCorrect(undefined, '@extends') );
        });
    });

    describe('hash start', function() {
        it ('should return true if = and { are found on the same line', function() {
            assert.equal( false, app.hashStarting('$myVar =') );
            assert.equal( false, app.hashStarting('myVar = @block') );
            assert.equal( false, app.hashStarting('.mistakenUseOfBracket {') );
            assert.equal( false, app.hashStarting('margin 0') );
            assert.equal( true, app.hashStarting('myHash = {') );
            assert.equal( undefined, app.hashStarting() );
        });
    });

    describe('hash end', function() {
        it ('should return true if 2nd param is set to true and } is found', function() {
            assert.equal( false, app.hashEnding('margin 0', true) );
            assert.equal( false, app.hashEnding('myHash = {', true) );
            assert.equal( false, app.hashEnding('margin 0', false) );
            assert.equal( false, app.hashEnding('myHash = {', false) );
            assert.equal( false, app.hashEnding('}', false) );
            assert.equal( true, app.hashEnding('}', true) );
            assert.equal( undefined, app.hashEnding('}') );
            assert.equal( undefined, app.hashEnding() );
        });
    });

    describe('leading zero', function() {
        it ('should return true if line has a zero before a decimal point and not part of range', function() {
            var test1 = 'color (0, 0, 0, 0.18)',
                test2 = 'color (0,0,0,0.18)',
                test3 = 'color (0, 0, 0, .18)',
                test4 = 'color (0,0,0,.18)',
                test5 = 'for $ in (0..9)';

            assert.equal( true, app.leadingZero( test1, test1.split(' ') ) );
            assert.equal( true, app.leadingZero( test2, test2.split(' ') ) );
            assert.equal( false, app.leadingZero( test3, test3.split(' ') ) );
            assert.equal( false, app.leadingZero( test4, test4.split(' ') ) );
            assert.equal( false, app.leadingZero( test5, test5.split(' ') ) );
            assert.equal( undefined, app.leadingZero() );
        });
    });

    describe('mixed spaces and tabs', function() {
        it ('should return true if spaces and tabs are mixed, false if not', function() {
            assert.equal( false, app.mixedSpacesAndTabs('    margin 0', 4) );
            assert.equal( false, app.mixedSpacesAndTabs('	margin 0', false) );
            assert.equal( true, app.mixedSpacesAndTabs('		margin 0', 4) );
            assert.equal( true, app.mixedSpacesAndTabs('	 	 margin 0', false) );
            assert.equal( true, app.mixedSpacesAndTabs('		padding 0em', 4) );
            assert.equal( undefined, app.mixedSpacesAndTabs() );
        });
    });

    describe('naming convention', function() {
        it ('should return true if correct naming convention, false if not, undefined if line not checkable', function() {
            assert.equal( true, app.namingConvention('$var-name-like-this =', 'lowercase-dash') );
            assert.equal( true, app.namingConvention('.class-name-like-this', 'lowercase-dash') );
            assert.equal( true, app.namingConvention('#id-name-like-this', 'lowercase-dash') );

            assert.equal( true, app.namingConvention('$var_name_like_this =', 'lowercase_underscore') );
            assert.equal( true, app.namingConvention('.class_name_like_this', 'lowercase_underscore') );
            assert.equal( true, app.namingConvention('#id_name_like_this', 'lowercase_underscore') );

            assert.equal( true, app.namingConvention('$varNameLikeThis =', 'camelCase') );
            assert.equal( true, app.namingConvention('.classNameLikeThis', 'camelCase') );
            assert.equal( true, app.namingConvention('#idNameLikeThis', 'camelCase') );

            assert.equal( false, app.namingConvention('$var_name_like_this =', 'lowercase-dash') );
            assert.equal( false, app.namingConvention('.class_name_like_this', 'lowercase-dash') );
            assert.equal( false, app.namingConvention('#id_name_like_this', 'lowercase-dash') );

            assert.equal( false, app.namingConvention('$var-name-like-this =', 'lowercase_underscore') );
            assert.equal( false, app.namingConvention('.class-name-like-this', 'lowercase_underscore') );
            assert.equal( false, app.namingConvention('#id-name-like-this', 'lowercase_underscore') );

            assert.equal( false, app.namingConvention('$var-name-like-this =', 'camelCase') );
            assert.equal( false, app.namingConvention('.class-name-like-this', 'camelCase') );
            assert.equal( false, app.namingConvention('#id-name-like-this', 'camelCase') );

            assert.equal( undefined, app.namingConvention('$var_name_like_this =', false) );
            assert.equal( undefined, app.namingConvention('.class_name_like_this', false) );
            assert.equal( undefined, app.namingConvention('#id_name_like_this', false) );
            assert.equal( undefined, app.namingConvention('$var-name-like-this =', false) );
            assert.equal( undefined, app.namingConvention('.class-name-like-this', false) );
            assert.equal( undefined, app.namingConvention('#id-name-like-this', false) );
            assert.equal( undefined, app.namingConvention('$var-name-like-this =', false) );
            assert.equal( undefined, app.namingConvention('.class-name-like-this', false) );
            assert.equal( undefined, app.namingConvention('#id-name-like-this', false) );
            assert.equal( undefined, app.namingConvention('margin 0', false) );
            assert.equal( undefined, app.namingConvention('margin 0', 'lowercase-dash') );
            assert.equal( undefined, app.namingConvention('padding inherit', 'camelCase') );
            assert.equal( undefined, app.namingConvention('body ', 'lowercase-underscore') );
            assert.equal( undefined, app.namingConvention() );
            assert.equal( undefined, app.namingConvention('.className') );
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
	        assert.equal( false, app.tooMuchNest( test1, test1.split(' '), 4, 4 ) );
	        assert.equal( false, app.tooMuchNest( test2, test2.split(' '), 4, 4 ) );
	        assert.equal( true, app.tooMuchNest( test3, test3.split(' '), 1, 4 ) );
	        assert.equal( true, app.tooMuchNest( test4, test4.split(' '), 2, 2 ) );
	        assert.equal( true, app.tooMuchNest( test5, test5.split(' '), 4, 4 ) );
	        assert.equal( true, app.tooMuchNest( test6, test6.split(' '), 4, false ) );
	        assert.equal( true, app.tooMuchNest( test7, test7.split(' '), 1, false ) );
            assert.equal( undefined, app.tooMuchNest( test8, test8.split(' '), undefined, false ) );
            assert.equal( undefined, app.tooMuchNest( test8, test8.split(' '), undefined, 4 ) );
            assert.equal( undefined, app.tooMuchNest( test8, test8.split(' '), undefined, undefined ) );
            assert.equal( undefined, app.tooMuchNest( test8, test8.split(' '), 4, undefined ) );
            assert.equal( undefined, app.tooMuchNest( undefined, undefined, 4, undefined ) );
            assert.equal( undefined, app.tooMuchNest() );
	    });
	});

    describe('paren style', function() {
        it ('should return true if extra spaces are found, false if not', function() {
            assert.equal( false, app.parenStyleCorrect('myMixin(param1, param2)') );
            assert.equal( true, app.parenStyleCorrect('myMixin( param1, param2 )') );
            assert.equal( undefined, app.parenStyleCorrect('.notAMixin ') );
            assert.equal( undefined, app.parenStyleCorrect() );
        });
    });

    describe('placeholder style', function() {
        it ('should return true if placeholder var is used, false if not', function() {
            assert.equal( false, app.placeholderStyleCorrect('@extends .notPlaceholderVar') );
            assert.equal( true, app.placeholderStyleCorrect('@extends $placeholderVar') );
            assert.equal( undefined, app.placeholderStyleCorrect('margin 0') );
            assert.equal( undefined, app.placeholderStyleCorrect() );
        });
    });

    describe('semicolon', function() {
        it ('should return true if semicolon is found', function() {
            assert.equal( false, app.semicolon('margin 0 auto') );
            assert.equal( true, app.semicolon('margin 0 auto;') );
            assert.equal( undefined, app.semicolon() );
        });
    });

    describe('trailing whitespace', function() {
        it ('should return true if whitespace found', function() {
            assert.equal( true, app.whitespace('margin 0 auto	') );
            assert.equal( true, app.whitespace('margin 0 auto ') );
            assert.equal( false, app.whitespace('margin 0 auto') );
            assert.equal( undefined, app.whitespace() );
        });
    });

    describe('universal selector', function() {
        it ('should return true if * is found', function() {
            assert.equal( false, app.universalSelector('img') );
            assert.equal( true, app.universalSelector('*') );
            assert.equal( true, app.universalSelector('*:before') );
            assert.equal( undefined, app.universalSelector() );
        });
    });

    // describe('valid property', function() {
    //     it ('should return true if property is valid, false if not', function() {
    //         assert.equal( false, app.validProperty( 'marg 0 auto', app.validCSS, app.validHTML ) );
    //         assert.equal( false, app.validProperty( 'pad 0', app.validCSS, app.validHTML ) );
    //         // assert.equal( true, app.validProperty( 'padding 0', app.validCSS, app.validHTML ) );
    //         assert.equal( true, app.validProperty( 'input', app.validCSS, app.validHTML ) );
    //         assert.equal( true, app.validProperty( 'body', app.validCSS, app.validHTML ) );
    //         assert.equal( true, app.validProperty( '$var-name = ', app.validCSS, app.validHTML ) );
    //         assert.equal( true, app.validProperty( '{var-name}', app.validCSS, app.validHTML ) );
    //         assert.equal( true, app.validProperty( 'my-hash = {', app.validCSS, app.validHTML ) );
    //         assert.equal( true, app.validProperty( 'for i in 0..9', app.validCSS, app.validHTML ) );
    //         assert.equal( undefined, app.validProperty( undefined, app.validCSS, app.validHTML ) );
    //         assert.equal( undefined, app.validProperty( 'body', undefined, app.validHTML ) );
    //         assert.equal( undefined, app.validProperty( 'body', app.validCSS, undefined ) );
    //     });
    // });

    /**
     * would like to have this be smarter
     * ideally it would know whether or not a $ should be used based on context
     * right now it just checks if $ is used when defining a var and thats it
     */
    describe('var style check', function() {
        it ('should return true if $ is found, false if not', function() {
            assert.equal( false, app.varStyleCorrect('myVar = 0') );
            assert.equal( true, app.varStyleCorrect('$myVar = 0') );
            assert.equal( true, app.varStyleCorrect('$first-value = floor( (100% / $columns) * $index )') );
            assert.equal( undefined, app.varStyleCorrect('define-my-mixin( $myParam )') );
            assert.equal( undefined, app.varStyleCorrect('if($myParam == true)') );
            assert.equal( undefined, app.varStyleCorrect('.notAVar') );
            assert.equal( undefined, app.varStyleCorrect('if(myParam == true)') );
            assert.equal( undefined, app.varStyleCorrect('define-my-mixin( myParam )') );
            assert.equal( undefined, app.varStyleCorrect('  use-my-mixin( myParam )') );
            assert.equal( undefined, app.varStyleCorrect('  if( $myParam )') );
            assert.equal( undefined, app.varStyleCorrect() );
        });
    });

    describe('zero units', function() {
        it ('should return true if 0 + any unit type is found (0 is preferred)', function() {
            assert.equal( true, app.zeroUnits('margin 0px') );
            assert.equal( true, app.zeroUnits('margin 0em') );
            assert.equal( true, app.zeroUnits('margin 0%') );
            assert.equal( true, app.zeroUnits('margin 0rem') );
            assert.equal( true, app.zeroUnits('margin 0pt') );
            assert.equal( true, app.zeroUnits('margin 0pc') );
            assert.equal( true, app.zeroUnits('margin 0vh') );
            assert.equal( true, app.zeroUnits('margin 0vw') );
            assert.equal( true, app.zeroUnits('margin 0vmin') );
            assert.equal( true, app.zeroUnits('margin 0vmax') );
            assert.equal( true, app.zeroUnits('margin 0mm') );
            assert.equal( true, app.zeroUnits('margin 0cm') );
            assert.equal( true, app.zeroUnits('margin 0in') );
            assert.equal( true, app.zeroUnits('margin 0mozmm') );
            assert.equal( true, app.zeroUnits('margin 0ex') );
            assert.equal( true, app.zeroUnits('margin 0ch') );
            assert.equal( false, app.zeroUnits('margin 0') );
            assert.equal( undefined, app.zeroUnits() );
        });
    });
});