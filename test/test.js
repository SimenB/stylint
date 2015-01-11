const
    fs = require('fs'),
	assert = require('assert'),
    should = require('chai').should(),
    sinon = require('sinon'),
    app = require('../index'),
    valid = require('../src/data/getValid')(),
    defaultConfig = {
        'borderNone': true, // check for use of border none and recommend border 0
        'brackets': false, // check for { or }, unless used in a hash
        'colons': false, // check for unecessary colons
        'commaSpace': true, // check for spaces after commas (0, 0, 0, .18)
        'commentSpace': false, // check for space after line comment
        'cssLiteral': false, // if true disallow css literals
        'depthLimit': false, // set a maximum selector depth (dont nest more than 4 deep)
        'efficient': true, // check for margin 0 0 0 0 and recommend margin 0
        'enforceVarStyle': false, // check for $ when declaring vars (doesnt check use)
        'enforceBlockStyle': false, // check for @block when defining blocks
        'extendPref': false, // prefer a specific syntax when using @extends (or @extend)
        'indentSpaces': 4, // how many spaces should we prefer when indenting, pass in false if hard tabs
        'leadingZero': true, // find cases where 0.# is used, prefer .#
        'maxWarnings': 10, // should we have a max amount of warnings, and error out if we go over
        'mixed': false, // check for mixed spaces and tabs
        'namingConvention': false, // lowercase-dash, camelCase, lowercase-underscore, or false (dont check)
        'parenSpace': false, // check for extra space inside parens when defining or using mixins
        'placeholders': true, // only allow @extending of placeholder vars
        'semicolons': false, // check for unecessary semicolons
        'trailingWhitespace': true, // check for trailing whitespace
        'universal': true, // check for use of * and recommend against it
        'valid': false, // check if prop or value is a valid assignment
        'zeroUnits': true, // check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
        'zIndexr': false // find z index values and suggested a normalized value of 5 (so, 5 - 10 - 15 - 20 )
    };

app.state.testENV = true;

describe('Core Methods: ', function() {
    describe('Read: ', function() {
        sinon.spy( app, 'read' );

        var dirTest = app.read( app, 'styl/'),
            fileTest = app.read( app, 'styl/test2.styl' ),
            cwdTest = app.read( app, process.cwd() ),
            failTest = app.read( app, 'nonExistantPath' );

        it('should be a function', function() {
            app.read.should.be.a( 'function' );
        });
        it('first param should be the app object', function() {
            assert.deepEqual( app.read.getCall(0).args[0], app );
        });
        it('second param should be a string', function() {
            app.read.getCall(0).args[1].should.be.a( 'string' );
        });
        it('should return parse function if passed a dir', function() {
            app.read.getCall(0).returned( sinon.match.same( app.parse ) );
        });
        it('should return a function if passed a filename', function() {
            app.read.getCall(1).returned( sinon.match.same( app.parse ) );
        });
        it('should return a function if nothing passed', function() {
            app.read.getCall(2).returned( sinon.match.same( app.parse ) );
        });
        it('should return undefined if path doesnt exist', function() {
            assert.equal( undefined, app.read.getCall(3).returnValue );
        });
    });

    describe('Parse: ', function() {
        sinon.spy( app, 'parseFile' );

        var fileTest = app.parseFile( app, 'styl/test2.styl' ),
            dirTest = app.parseFile( app, 'styl/'),
            failTest = app.parseFile( app, 'nonExistantPath' );

        it('should be a function', function() {
            app.parseFile.should.be.a( 'function' );
        });
        it('first param should be the app object', function() {
            assert.deepEqual( app.parseFile.getCall(0).args[0], app );
        });
        it('second param should be a string', function() {
            app.parseFile.getCall(0).args[1].should.be.a( 'string' );
        });
        it('should return test function if passed a filename', function() {
            app.parseFile.getCall(0).returned( sinon.match.same( app.test ) );
        });
        it('should return undefined if path is directory', function() {
            assert.equal( undefined, app.parseFile.getCall(1).returnValue );
        });
        it('should return undefined if path doesnt exist', function() {
            assert.equal( undefined, app.parseFile.getCall(2).returnValue );
        });
    });

    describe('Test: ', function() {
        sinon.spy( app, 'test' );
        var test = app.test( app, '  margin 0 auto ', 5, 'margin 0 auto', 'styl/test2.styl' );

        it('should be a function', function() {
            app.test.should.be.a( 'function' );
        });
        it('first param should be the app object', function() {
            assert.deepEqual( app.test.getCall(0).args[0], app );
        });
        it('second param should be a string', function() {
            app.test.getCall(0).args[1].should.be.a( 'string' );
        });
        it('third param should be a number', function() {
            app.test.getCall(0).args[2].should.be.a( 'number' );
        });
        it('fourth param should be a string', function() {
            app.test.getCall(0).args[3].should.be.a( 'string' );
        });
        it('fifth param should be a string', function() {
            app.test.getCall(0).args[4].should.be.a( 'string' );
        });
        it('should return undefined', function() {
            assert.equal( undefined, app.test.getCall(0).returnValue );
        });
    });

    describe('Watch: ', function() {
        sinon.spy( app, 'watch' );
        var fileTest = app.watch( app, 'styl/test2.styl' );

        it('should be a function', function() {
            app.watch.should.be.a( 'function' );
        });
        it('first param should be the app object', function() {
            assert.deepEqual( app.watch.getCall(0).args[0], app );
        });
        it('second param should be a string', function() {
            app.watch.getCall(0).args[1].should.be.a( 'string' );
        });
        it('should return undefined', function() {
            assert.equal( undefined, app.watch.getCall(0).returnValue );
        });
    });

    describe('Help: ', function() {
        sinon.spy( app, 'help' );
        var test = app.help( app );

        it('should be a function', function() {
            app.help.should.be.a( 'function' );
        });
        it('should return undefined', function() {
            assert.equal( undefined, app.help.getCall(0).returnValue );
        });
    });

    describe('Version: ', function() {
        sinon.spy( app, 'ver' );
        var test = app.ver( app );

        it('should be a function', function() {
            app.ver.should.be.a( 'function' );
        });
        it('should return a console log function', function() {
            app.ver.getCall(0).returned( sinon.match.same( console.log ) );
        });
    });
});

describe('Config: ', function() {
    describe('Default Config:', function() {
        it('should deep equal mocked config', function() {
            assert.deepEqual( app.config, defaultConfig );
        });
    });

    // @TODO this one is not that great
    describe('Set Config Method:', function() {
        var
            testMethod = app.setConfig( '.stylintrc' ),
            testConfig = JSON.parse( fs.readFileSync( process.cwd() + '/.stylintrc' ) );

        it('should update config state if passed a valid path', function() {
            assert.deepEqual( testMethod, testConfig );
        });

        it('should return undefined if passed invalid path', function() {
            should.Throw(function(){
                app.setConfig( '.nonsenserc' )
            }, Error);
        });
    });
});

describe('File parser: ', function() {
    sinon.spy( app, 'getFiles' );
    var test = app.getFiles( '/styl' );

    it('should return app.parseFile if passed directory', function() {
        app.getFiles.getCall(0).returned( sinon.match.same( app.parseFile ) );
    });

    it('should return undefined if passed filename', function() {
        assert.equal( undefined, app.getFiles( '/styl/test2.styl' ) );
    });

    it('should throw if passed nothing', function() {
        should.Throw(function(){
            assert.equal( undefined, app.getFiles() );
        }, Error);
    });
});

describe('Flags: ', function() {
    describe('Default Flags:', function() {
        var defaultFlags = [
            '-c',
            '-w',
            '-s',
            '-v',
            '-h',
            '--config',
            '--watch',
            '--strict',
            '--version',
            '--help'
        ];

        it('should deep equal mocked default flags', function() {
            assert.deepEqual( app.flags, defaultFlags );
        });
    });
});

describe('State: ', function() {
    describe('Default State:', function() {
        var defaultState = {
            cssBlock: false,
            dir: '-u',
            hash: false,
            strictMode: false,
            testsEnabled: true, // are we running linter tests
            testENV: false, // are we running unit tests
            toggleBlock: false // @stylint off
        };

        it('cssBlock should be false', function() {
            assert.equal( false, app.state.cssBlock );
        });
        it('dir should be undefined', function() {
            assert.equal( '-u', app.state.dir );
        });
        it('hash should be false', function() {
            assert.equal( false, app.state.hash );
        });
        it('strictMode should be false', function() {
            assert.equal( false, app.state.hash );
        });
        it('strictMode should be false', function() {
            assert.equal( false, app.state.strictMode );
        });
        it('testsEnabled should be true', function() {
            assert.equal( true, app.state.testsEnabled );
        });
        it('testENV should be true', function() {
            assert.equal( true, app.state.testENV );
        });
        it('toggleBlock should be false', function() {
            assert.equal( false, app.state.toggleBlock );
        });
    });
});

describe('Linter Style Checks: ', function() {

    describe('block style', function() {
        it('should return false if block style incorrect', function() {
            assert.equal( false, app.blockStyleCorrect('myBlock = ') );
            assert.equal( false, app.blockStyleCorrect('myBlock =') );
        });
        it('should return true if block style correct', function() {
            assert.equal( true, app.blockStyleCorrect('myBlock = @block') );
            assert.equal( true, app.blockStyleCorrect('myBlock = @block ') );
        });
        it('should return undefined if not block', function() {
            assert.equal( undefined, app.blockStyleCorrect('margin 0') );
            assert.equal( undefined, app.blockStyleCorrect('myHash = {') );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.blockStyleCorrect() );
        });
    });

    describe('border none', function() {
        it('should return false if border none not present', function() {
            assert.equal( false, app.checkBorderNone('border 0') );
        });
        it('should return true if border none is present', function() {
            assert.equal( true, app.checkBorderNone('border none') );
        });
        it('should return undefined if no border', function() {
            assert.equal( undefined, app.checkBorderNone('margin 0') );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.checkBorderNone() );
        });
    });

    // 2nd param being passed in here determines if we're in a hash or not (true means hash)
    describe('brackets', function() {
        it ('should return false if illegal bracket not found', function() {
            assert.equal( false, app.brackets('}', true) );
            assert.equal( false, app.brackets('{interpolation}', true) );
            assert.equal( false, app.brackets('{interpolation}', false) );
            assert.equal( false, app.brackets('.class-name-with-{i}', false) );
            assert.equal( false, app.brackets('.class-name-with-{i}', true) );
        });
        it ('should return true if illegal bracket found on line (not interpolation, not hash)', function() {
            assert.equal( true, app.brackets('.className {', false) );
            assert.equal( true, app.brackets('.className {', true) );
            assert.equal( true, app.brackets('}', false) );
        });
        it ('should return undefined if missing params', function() {
            assert.equal( undefined, app.brackets('.className ', true) );
            assert.equal( undefined, app.brackets('.className ', false) );
            assert.equal( undefined, app.brackets('}', undefined) );
            assert.equal( undefined, app.brackets(undefined, false) );
            assert.equal( undefined, app.brackets(undefined, true) );
            assert.equal( undefined, app.brackets() );
        });
    });

    describe('has comment', function() {
        it ('should return false if // not present at all on line', function() {
            assert.equal( false, app.hasComment('.noCommentOnThisLine ') );
        });
        it ('should return true if // is present anywhere on the line', function() {
            assert.equal( true, app.hasComment('//test') );
            assert.equal( true, app.hasComment('margin 0 auto //test') );
            assert.equal( true, app.hasComment('margin 0 auto // test') );
            assert.equal( true, app.hasComment('// test') );
        });
        it ('should return undefined if missing params', function() {
            assert.equal( undefined, app.hasComment() );
        });
    });

    describe('starts with comment', function() {
        it('should return false if // not first char on line', function() {
            assert.equal( false, app.startsWithComment('margin 0 auto //test') );
        });
        it('should return true if // is the first character on the line', function() {
            assert.equal( true, app.startsWithComment('//test') );
            assert.equal( true, app.startsWithComment(' // test') );
        });
        it ('should return undefined if missing params', function() {
            assert.equal( undefined, app.startsWithComment('.noCommentOnThisLine ') );
            assert.equal( undefined, app.startsWithComment() );
        });
    });

    describe('comment style', function() {
        it('should return false if line comment doesnt have a space after it', function() {
            assert.equal( false, app.commentStyleCorrect('//test') );
            assert.equal( false, app.commentStyleCorrect('margin 0 auto //test') );
        });
        it('should return true if line comment has space after it', function() {
            assert.equal( true, app.commentStyleCorrect('margin 0 auto // test') );
            assert.equal( true, app.commentStyleCorrect('// test') );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.commentStyleCorrect('.noCommentOnThisLine') );
            assert.equal( undefined, app.commentStyleCorrect() );
        });
    });

    describe('comma style', function() {
        it('should return false if no space after commas', function() {
            assert.equal( false, app.commaStyleCorrect('0,0, 0, .18') );
        });
        it('should return true if space after commas', function() {
            assert.equal( true, app.commaStyleCorrect('0, 0, 0, .18') );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.commaStyleCorrect('.no-need-for-comma') );
            assert.equal( undefined, app.commaStyleCorrect() );
        });
    });

    describe('colons', function() {
        it('should return false if no unecessary colons found', function() {
            assert.equal( false, app.colon('margin 0 auto', false) );
            assert.equal( false, app.colon('key: value', true) );
        });
        it('should return true if unecessary colon is found', function() {
            assert.equal( true, app.colon('margin: 0 auto', false) );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.colon('margin: 0 auto') );
            assert.equal( undefined, app.colon() );
            assert.equal( undefined, app.colon(undefined, false) );
            assert.equal( undefined, app.colon(undefined, true) );
        });
    });

    describe('css literal', function() {
        it('should return false if @css is not used', function() {
            assert.equal( false, app.cssLiteral('not a css literal') );
            assert.equal( false, app.cssLiteral('@extends $placeholderVar') );
        });
        it('should return true if @css is used, false if not', function() {
            assert.equal( true, app.cssLiteral('@css {') );
        });
        it('should return undefined if missing params', function() {
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

        it('should return false if value is not efficient', function() {
            assert.equal( false, app.efficient( test1, test1.split(' ') ) );
            assert.equal( false, app.efficient( test2, test2.split(' ') ) );
            assert.equal( false, app.efficient( test3, test3.split(' ') ) );
            assert.equal( false, app.efficient( test4, test4.split(' ') ) );
            assert.equal( false, app.efficient( test5, test5.split(' ') ) );
            assert.equal( false, app.efficient( test6, test6.split(' ') ) );
            assert.equal( false, app.efficient( test7, test7.split(' ') ) );
        });
        it('should return true if value is efficient', function() {
            assert.equal( true, app.efficient( test8, test8.split(' ') ) );
            assert.equal( true, app.efficient( test9, test9.split(' ') ) );
            assert.equal( true, app.efficient( test10, test10.split(' ') ) );
            assert.equal( true, app.efficient( test11, test11.split(' ') ) );
            assert.equal( true, app.efficient( test12, test12.split(' ') ) );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.efficient( test13, test13.split(' ') ) );
            assert.equal( undefined, app.efficient() );
        });
    });

    describe('extends style', function() {
        it('should return false if value doesnt match preferred style', function() {
            assert.equal( false, app.extendStyleCorrect('@extend $placeHolderVar', '@extends') );
            assert.equal( false, app.extendStyleCorrect('@extends $placeHolderVar', '@extend') );
        });
        it('should return true if value matches preferred style', function() {
            assert.equal( true, app.extendStyleCorrect('@extend $placeHolderVar', '@extend') );
            assert.equal( true, app.extendStyleCorrect('@extends $placeHolderVar', '@extends') );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.extendStyleCorrect('@extends $placeHolderVar') );
            assert.equal( undefined, app.extendStyleCorrect() );
            assert.equal( undefined, app.extendStyleCorrect(undefined, '@extends') );
        });
    });

    describe('hash start', function() {
        it('should return false if hash start not found', function() {
            assert.equal( false, app.hashStarting('$myVar =') );
            assert.equal( false, app.hashStarting('myVar = @block') );
            assert.equal( false, app.hashStarting('.mistakenUseOfBracket {') );
            assert.equal( false, app.hashStarting('margin 0') );
        });
        it('should return true if = and { are found on the same line', function() {
            assert.equal( true, app.hashStarting('myHash = {') );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.hashStarting() );
        });
    });

    describe('hash end', function() {
        it('should return false if hash end not found', function() {
            assert.equal( false, app.hashEnding('margin 0', true) );
            assert.equal( false, app.hashEnding('myHash = {', true) );
            assert.equal( false, app.hashEnding('margin 0', false) );
            assert.equal( false, app.hashEnding('myHash = {', false) );
            assert.equal( false, app.hashEnding('}', false) );
        });
        it('should return true if 2nd param is set to true and valid } found', function() {
            assert.equal( true, app.hashEnding('}', true) );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.hashEnding('}') );
            assert.equal( undefined, app.hashEnding() );
        });
    });

    describe('leading zero', function() {
        var test1 = 'color (0, 0, 0, 0.18)',
            test2 = 'color (0,0,0,0.18)',
            test3 = 'color (0, 0, 0, .18)',
            test4 = 'color (0,0,0,.18)',
            test5 = 'for $ in (0..9)';

        it('should return true if line has a zero before a decimal point and not part of range', function() {
            assert.equal( true, app.leadingZero( test1, test1.split(' ') ) );
            assert.equal( true, app.leadingZero( test2, test2.split(' ') ) );
        });
        it('should return false if leading zero not found', function() {
            assert.equal( false, app.leadingZero( test3, test3.split(' ') ) );
            assert.equal( false, app.leadingZero( test4, test4.split(' ') ) );
            assert.equal( false, app.leadingZero( test5, test5.split(' ') ) );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.leadingZero() );
        });
    });

    describe('mixed spaces and tabs', function() {
        it('should return false if no mixed spaces and tabs found', function() {
            assert.equal( false, app.mixedSpacesAndTabs('    margin 0', 4) );
            assert.equal( false, app.mixedSpacesAndTabs('	margin 0', false) );
        });
        it('should return true if spaces and tabs are mixed', function() {
            assert.equal( true, app.mixedSpacesAndTabs('		margin 0', 4) );
            assert.equal( true, app.mixedSpacesAndTabs('	 	 margin 0', false) );
            assert.equal( true, app.mixedSpacesAndTabs('		padding 0em', 4) );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.mixedSpacesAndTabs() );
        });
    });

    describe('naming convention', function() {
        it('should return true if correct naming convention', function() {
            assert.equal( true, app.namingConvention('$var-name-like-this =', 'lowercase-dash') );
            assert.equal( true, app.namingConvention('.class-name-like-this', 'lowercase-dash') );
            assert.equal( true, app.namingConvention('#id-name-like-this', 'lowercase-dash') );

            assert.equal( true, app.namingConvention('$var_name_like_this =', 'lowercase_underscore') );
            assert.equal( true, app.namingConvention('.class_name_like_this', 'lowercase_underscore') );
            assert.equal( true, app.namingConvention('#id_name_like_this', 'lowercase_underscore') );

            assert.equal( true, app.namingConvention('$varNameLikeThis =', 'camelCase') );
            assert.equal( true, app.namingConvention('.classNameLikeThis', 'camelCase') );
            assert.equal( true, app.namingConvention('#idNameLikeThis', 'camelCase') );

        });

        it('false if not correct naming convention', function() {
            assert.equal( false, app.namingConvention('$var_name_like_this =', 'lowercase-dash') );
            assert.equal( false, app.namingConvention('.class_name_like_this', 'lowercase-dash') );
            assert.equal( false, app.namingConvention('#id_name_like_this', 'lowercase-dash') );

            assert.equal( false, app.namingConvention('$var-name-like-this =', 'lowercase_underscore') );
            assert.equal( false, app.namingConvention('.class-name-like-this', 'lowercase_underscore') );
            assert.equal( false, app.namingConvention('#id-name-like-this', 'lowercase_underscore') );

            assert.equal( false, app.namingConvention('$var-name-like-this =', 'camelCase') );
            assert.equal( false, app.namingConvention('.class-name-like-this', 'camelCase') );
            assert.equal( false, app.namingConvention('#id-name-like-this', 'camelCase') );
        });

        it('and undefined if line not checkable', function() {
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

	    it('should return false if less indents than 2nd param', function() {
	        assert.equal( false, app.tooMuchNest( test1, test1.split(' '), 4, 4 ) );
	        assert.equal( false, app.tooMuchNest( test2, test2.split(' '), 4, 4 ) );
        });
        it('should return true if more indents than 2nd param', function() {
	        assert.equal( true, app.tooMuchNest( test3, test3.split(' '), 1, 4 ) );
	        assert.equal( true, app.tooMuchNest( test4, test4.split(' '), 2, 2 ) );
	        assert.equal( true, app.tooMuchNest( test5, test5.split(' '), 4, 4 ) );
	        assert.equal( true, app.tooMuchNest( test6, test6.split(' '), 4, false ) );
	        assert.equal( true, app.tooMuchNest( test7, test7.split(' '), 1, false ) );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.tooMuchNest( test8, test8.split(' '), undefined, false ) );
            assert.equal( undefined, app.tooMuchNest( test8, test8.split(' '), undefined, 4 ) );
            assert.equal( undefined, app.tooMuchNest( test8, test8.split(' '), undefined, undefined ) );
            assert.equal( undefined, app.tooMuchNest( test8, test8.split(' '), 4, undefined ) );
            assert.equal( undefined, app.tooMuchNest( undefined, undefined, 4, undefined ) );
            assert.equal( undefined, app.tooMuchNest() );
	    });
	});

    describe('paren style', function() {
        it('should return false if no parens spacing found', function() {
            assert.equal( false, app.parenStyleCorrect('myMixin(param1, param2)') );
        });
        it('should return true if correct parens spacing found', function() {
            assert.equal( true, app.parenStyleCorrect('myMixin( param1, param2 )') );
        });
        it('should return undefined if no parens on line', function() {
            assert.equal( undefined, app.parenStyleCorrect('.notAMixin ') );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.parenStyleCorrect() );
        });
    });

    describe('placeholder style', function() {
        it('should return false if placeholder var not used', function() {
            assert.equal( false, app.placeholderStyleCorrect('@extends .notPlaceholderVar') );
        });
        it('should return true if placeholder var is used', function() {
            assert.equal( true, app.placeholderStyleCorrect('@extends $placeholderVar') );
        });
        it('should return undefined if no extend found', function() {
            assert.equal( undefined, app.placeholderStyleCorrect('margin 0') );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.placeholderStyleCorrect() );
        });
    });

    describe('semicolon', function() {
        it('should return false if no semicolon is found', function() {
            assert.equal( false, app.semicolon('margin 0 auto') );
        });
        it('should return true if semicolon found', function() {
            assert.equal( true, app.semicolon('margin 0 auto;') );
        });
        it('should return undefined if params missing', function() {
            assert.equal( undefined, app.semicolon() );
        });
    });

    describe('trailing whitespace', function() {
        it('should return false if no trailing whitespace', function() {
            assert.equal( false, app.whitespace('margin 0 auto') );
        });
        it('should return true if whitespace found', function() {
            assert.equal( true, app.whitespace('margin 0 auto	') );
            assert.equal( true, app.whitespace('margin 0 auto ') );
        });
        it('should return undefined if params missing', function() {
            assert.equal( undefined, app.whitespace() );
        })
    });

    describe('universal selector', function() {
        it('should return false if no * is found', function() {
            assert.equal( false, app.universalSelector('img') );
        });
        it('should return true if * is found', function() {
            assert.equal( true, app.universalSelector('*') );
            assert.equal( true, app.universalSelector('*:before') );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.universalSelector() );
        });
    });

    describe('valid property', function() {
        it ('should return false if property not valid', function() {
            assert.equal( false, app.validProperty( 'marg 0 auto', valid ) );
            assert.equal( false, app.validProperty( 'pad 0', valid ) );
        });
        it ('should return true if property is valid', function() {
            assert.equal( true, app.validProperty( 'padding 0', valid ) );
            assert.equal( true, app.validProperty( 'input', valid ) );
            assert.equal( true, app.validProperty( 'body', valid ) );
            assert.equal( true, app.validProperty( '$var-name = ', valid ) );
            assert.equal( true, app.validProperty( '{var-name}', valid ) );
            assert.equal( true, app.validProperty( 'my-hash = {', valid ) );
            assert.equal( true, app.validProperty( 'for i in 0..9', valid ) );
        });
        it ('should return undefined if missing params', function() {
            assert.equal( undefined, app.validProperty( undefined, valid ) );
            assert.equal( undefined, app.validProperty( 'body', undefined ) );
            assert.equal( undefined, app.validProperty() );
        });
    });

    /**
     * would like to have this be smarter
     * ideally it would know whether or not a $ should be used based on context
     * right now it just checks if $ is used when defining a var and thats it
     */
    describe('var style check', function() {
        it('should return false if $ is missing', function() {
            assert.equal( false, app.varStyleCorrect('myVar = 0') );
        });
        it('should return true if $ is found (and correct', function() {
            assert.equal( true, app.varStyleCorrect('$myVar = 0') );
            assert.equal( true, app.varStyleCorrect('$first-value = floor( (100% / $columns) * $index )') );
        });
        it('should return undefined if line not testable', function() {
            assert.equal( undefined, app.varStyleCorrect('define-my-mixin( $myParam )') );
            assert.equal( undefined, app.varStyleCorrect('if($myParam == true)') );
            assert.equal( undefined, app.varStyleCorrect('.notAVar') );
            assert.equal( undefined, app.varStyleCorrect('if(myParam == true)') );
            assert.equal( undefined, app.varStyleCorrect('define-my-mixin( myParam )') );
            assert.equal( undefined, app.varStyleCorrect('  use-my-mixin( myParam )') );
            assert.equal( undefined, app.varStyleCorrect('  if( $myParam )') );
        });
        it('should return undefined if params missing', function() {
            assert.equal( undefined, app.varStyleCorrect() );
        });
    });

    describe('zero units', function() {
        it('should return false if 0 found', function() {
            assert.equal( false, app.zeroUnits('margin 0') );
        });
        it('should return true if 0 + any unit type is found (0 is preferred)', function() {
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
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.zeroUnits() );
        });
    });

    describe('zIndexr', function() {
        it('should return false if z-index is not found on line', function() {
            assert.equal( false, app.zIndexr('margin 0') );
        });
        it('should return true if z-index is found on line', function() {
            assert.equal( true, app.zIndexr('z-index -1') );
        });
        it('should return undefined if missing params', function() {
            assert.equal( undefined, app.zIndexr() );
        });
    });
});