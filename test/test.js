/**
 * UNIT TESTS
 * lets pull in what we're testing here
 */

const
	fs = require('fs'),
	assert = require('assert'),
	should = require('chai').should(),
	sinon = require('sinon'),
	app = require('../index'),
	// valid just gets our data for us... maybe this doesn't need to be a module
	valid = require('../src/data/getValid')(),
	// we mock this here so if the real one ever changes it throws an error (alerting me to double check it)
	defaultConfig = {
		alphabetical: true, // check that properties are sorted alphabetically
		borderNone: true, // check for use of border none and recommend border 0
		brackets: true, // check for { or }, unless used in a hash
		colons: false, // check for unecessary colons
		colors: false, // check for hex colors used without variables
		commaSpace: true, // check for spaces after commas (0, 0, 0, .18)
		commentSpace: false, // check for space after line comment
		cssLiteral: false, // if true disallow css literals
		depthLimit: false, // set a maximum selector depth (dont nest more than 4 deep)
		duplicates: true, // check if properties or selectors are duplicate
		efficient: true, // check for margin 0 0 0 0 and recommend margin 0
		emoji: false, // toggle emoji on or off
		enforceVarStyle: false, // check for $ when declaring vars (doesnt check use)
		enforceBlockStyle: false, // check for @block when defining blocks
		extendPref: false, // prefer a specific syntax when using @extends (or @extend)
		globalDupe: false, // throw duplicate selector warning across all files instead of curr file
		indentSpaces: 4, // how many spaces should we prefer when indenting, pass in false if hard tabs
		leadingZero: true, // find cases where 0.# is used, prefer .#
		maxWarnings: 10, // should we have a max amount of warnings, and error out if we go over
		maxWarningsKill: false, // if over maxWarning count, kill process
		mixed: false, // check for mixed spaces and tabs
		namingConvention: false, // lowercase-dash, camelCase, lowercase_underscore, BEM or false (dont check)
		namingConventionStrict: false, // if true, then check classes and ids, if false just check variables
		parenSpace: false, // check for extra space inside parens when defining or using mixins
		placeholders: true, // only allow @extending of placeholder vars
		quotePref: false, // single or double quotes, or false to not check
		semicolons: false, // check for unecessary semicolons
		trailingWhitespace: true, // check for trailing whitespace
		universal: true, // check for use of * and recommend against it
		valid: false, // check if prop or value is a valid assignment
		zeroUnits: true, // check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
		zIndexDuplicates: false, // just find duplicate z index values
		zIndexNormalize: false // suggest a normalized z index value, base of whatever this is
	};


// turning on strict mode from this point
app.state.strictMode = true;
app.state.watching = true;

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
		sinon.spy( app, 'parse' );

		var fileTest = app.parse( app, 'styl/test2.styl' ),
			dirTest = app.parse( app, 'styl/'),
			cwdTest = app.read( app, process.cwd() ),
			failTest = app.parse( app, 'nonExistantPath' );

		it('should be a function', function() {
			app.parse.should.be.a( 'function' );
		});

		it('first param should be the app object', function() {
			assert.deepEqual( app.parse.getCall(0).args[0], app );
		});

		it('second param should be a string', function() {
			app.parse.getCall(0).args[1].should.be.a( 'string' );
		});

		it('should return test function if passed a filename', function() {
			app.parse.getCall(0).returned( sinon.match.same( app.test ) );
		});

		it('should return undefined if path is directory', function() {
			assert.equal( undefined, app.parse.getCall(1).returnValue );
		});

		it('should return undefined if path is cwd', function() {
			assert.equal( undefined, app.parse.getCall(2).returnValue );
		});

		it('should return undefined if path doesnt exist', function() {
			assert.equal( undefined, app.parse.getCall(3).returnValue );
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

	// describe('Done: ', function() {
	// 	sinon.spy( app, 'done' );
	// 	var test = app.done( app );
	// });

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
	describe('Set Config Method:', function() {
		var
			testMethod = app.setConfig( '.stylintrc' ),
			testConfig = JSON.parse( fs.readFileSync( process.cwd() + '/.stylintrc' ) );

		it('should update config state if passed a valid path', function() {
			assert.deepEqual( testMethod, testConfig );
		});

		it('should return undefined if passed invalid path', function() {
			should.Throw(function() {
				app.setConfig( '.nonsenserc' );
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

	it('should throw if path is not a string', function() {
		should.Throw(function() {
			app.getFiles( 5 );
		}, TypeError);
	});

	it('should throw if passed nothing', function() {
		should.Throw(function() {
			app.getFiles();
		}, Error);
	});
});

describe('Emoji: ', function() {
	it('all clear if on windows and option turned on should output smiley', function() {
		assert.equal( ':)', app.emojiAllClear( true, 'windows' ) );
	});

	it('warning if on windows and option turned on should output frowney', function() {
		assert.equal( ':(', app.emojiWarning( true, 'windows' ) );
	});

	it('all clear if on unix and option turned on should output emoji', function() {
		assert.equal( '\uD83D\uDC4D  ', app.emojiAllClear( true ) );
	});

	it('warning if on unix and option turned on should output emoji', function() {
		assert.equal( '\uD83D\uDCA9  ', app.emojiWarning( true ) );
	});

	it('both should output a blank string if option is off', function() {
		assert.equal( '', app.emojiAllClear( false ) );
		assert.equal( '', app.emojiWarning( false ) );
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
			'--help',
			'--harmony'
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
			dir: undefined,
			exitCode: 0,
			hash: false,
			strictMode: false,
			testsEnabled: true, // are we running linter tests
			toggleBlock: false, // @stylint off
			watching: false
		};

		it('cssBlock should be false', function() {
			assert.equal( false, app.state.cssBlock );
		});

		it('hash should be false', function() {
			assert.equal( false, app.state.hash );
		});

		// we set this earlier for testing
		it('strictMode should be true', function() {
			assert.equal( true, app.state.strictMode );
		});

		it('testsEnabled should be true', function() {
			assert.equal( true, app.state.testsEnabled );
		});

		it('toggleBlock should be false', function() {
			assert.equal( false, app.state.toggleBlock );
		});
	});
});

describe('Linter Style Checks: ', function() {
	describe('alphabetical', function() {
		it('should return true with mocked alpha cache', function() {
			app.alphaCache = [ 'border', 'margin', 'padding' ];
			assert.equal( true, app.alphabet( 'z-index', valid ) );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.alphabet( undefined, valid ) );
			assert.equal( undefined, app.alphabet( 'z-index' ) );
			assert.equal( undefined, app.alphabet() );
		});
	});

	describe('block style', function() {
		it('should return false if block style incorrect', function() {
			assert.equal( false, app.block('myBlock = ') );
			assert.equal( false, app.block('myBlock =') );
		});

		it('should return true if block style correct', function() {
			assert.equal( true, app.block('myBlock = @block') );
			assert.equal( true, app.block('myBlock = @block ') );
		});

		it('should return undefined if not block', function() {
			assert.equal( undefined, app.block('margin 0') );
			assert.equal( undefined, app.block('myHash = {') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.block() );
		});
	});

	describe('border none', function() {
		it('should return false if border none not present', function() {
			assert.equal( false, app.borderNone('border 0') );
			assert.equal( false, app.borderNone('border: 0') );
			assert.equal( false, app.borderNone('border:0') );
		});

		it('should return true if border none is present', function() {
			assert.equal( true, app.borderNone('border none') );
			assert.equal( true, app.borderNone('border: none') );
			assert.equal( true, app.borderNone('border:none') );
		});

		it('should return undefined if no border', function() {
			assert.equal( undefined, app.borderNone('margin 0') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.borderNone() );
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
			assert.equal( false, app.commentExists('.noCommentOnThisLine ') );
		});

		it ('should return true if // is present anywhere on the line', function() {
			assert.equal( true, app.commentExists('//test') );
			assert.equal( true, app.commentExists('margin 0 auto //test') );
			assert.equal( true, app.commentExists('margin 0 auto // test') );
			assert.equal( true, app.commentExists('// test') );
		});

		it ('should return undefined if missing params', function() {
			assert.equal( undefined, app.commentExists() );
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
			assert.equal( false, app.commentSpace('//test') );
			assert.equal( false, app.commentSpace('margin 0 auto //test') );
		});

		it('should return true if line comment has space after it', function() {
			assert.equal( true, app.commentSpace('margin 0 auto // test') );
			assert.equal( true, app.commentSpace('// test') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.commentSpace('.noCommentOnThisLine') );
			assert.equal( undefined, app.commentSpace() );
		});
	});

	describe('comma style', function() {
		it('should return false if no space after commas', function() {
			assert.equal( false, app.comma('0,0, 0, .18') );
		});

		it('should return true if space after commas', function() {
			assert.equal( true, app.comma('0, 0, 0, .18') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.comma('.no-need-for-comma') );
			assert.equal( undefined, app.comma() );
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

	describe('duplicates', function() {
		app.selectorCache = ['margin-bottom', 'margin-top', 'z-index'];
		app.rootCache = ['.test', 'body', '.test2'];

		it('should return false if missing 2nd param', function() {
			assert.equal( false, app.duplicates( 'test', undefined ) );
		});

		it('should return true if in-context selector is duplicate', function() {
			app.duplicates( '   .test', 'file.styl' ); // to set the context
			assert.equal( true, app.duplicates( '   .test', 'file.styl' ) );
		});

		it('should return true if root selector is duplicate', function() {
			app.duplicates( '.test', 'file.style' ); // to set the context
			assert.equal( true, app.duplicates( '.test', 'file.styl' ) );
		});

		it('should return undefined if missing 1st or both params', function() {
			assert.equal( undefined, app.duplicates() );
			assert.equal( undefined, app.duplicates( undefined, 'file.styl' ) );
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
			assert.equal( false, app.extend('@extend $placeHolderVar', '@extends') );
			assert.equal( false, app.extend('@extends $placeHolderVar', '@extend') );
		});

		it('should return true if value matches preferred style', function() {
			assert.equal( true, app.extend('@extend $placeHolderVar', '@extend') );
			assert.equal( true, app.extend('@extends $placeHolderVar', '@extends') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.extend('@extends $placeHolderVar') );
			assert.equal( undefined, app.extend() );
			assert.equal( undefined, app.extend(undefined, '@extends') );
		});
	});

	describe('hash start', function() {
		it('should return false if hash start not found', function() {
			assert.equal( false, app.hashStart('$myVar =') );
			assert.equal( false, app.hashStart('myVar = @block') );
			assert.equal( false, app.hashStart('.mistakenUseOfBracket {') );
			assert.equal( false, app.hashStart('margin 0') );
		});

		it('should return true if = and { are found on the same line', function() {
			assert.equal( true, app.hashStart('myHash = {') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.hashStart() );
		});
	});

	describe('hash end', function() {
		it('should return false if hash end not found', function() {
			assert.equal( false, app.hashEnd('margin 0', true) );
			assert.equal( false, app.hashEnd('myHash = {', true) );
			assert.equal( false, app.hashEnd('margin 0', false) );
			assert.equal( false, app.hashEnd('myHash = {', false) );
			assert.equal( false, app.hashEnd('}', false) );
		});

		it('should return true if 2nd param is set to true and valid } found', function() {
			assert.equal( true, app.hashEnd('}', true) );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.hashEnd('}') );
			assert.equal( undefined, app.hashEnd() );
		});
	});

	describe('colors', function () {
	  var test1 = '#fff';
	  var test2 = '.foo';
	  var test3 = '$foobar ?= #fff';

	  it('should return true if a line has a hex color', function () {
		assert.equal( true, app.colors(test1) );
	  });

	  it('should return false if a line does not have a hex color', function () {
		assert.equal( false, app.colors(test2) );
	  });

	  it('should return false if a hex color is assigned to a variable', function () {
		assert.equal( false, app.colors(test3) );
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
			var
				test1 = '    margin 0',
				test2 = '	margin 0';

			assert.equal( false, app.mixed( test1, test1.split(' '), 4 ) );
			assert.equal( false, app.mixed( test2, test2.split(' '), false ) );
		});

		it('should return true if spaces and tabs are mixed', function() {
			var
				test1 = '	  margin 0',
				test2 = '	    margin 0',
				test3 = '	padding 0em';

			assert.equal( true, app.mixed( test1, test1.split(' '), 4 ) );
			assert.equal( true, app.mixed( test2, test2.split(' '), false ) );
			assert.equal( true, app.mixed( test3, test3.split(' '), 4 ) );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.mixed() );
		});
	});

	describe('naming convention', function() {
		beforeEach(function() {
			app.config.namingConventionStrict = true;
		});

		describe('strict', function() {
			it('should return true if correct naming convention', function() {
				assert.equal( true, app.namingConvention('$var-name-like-this =', 'lowercase-dash') );
				assert.equal( true, app.namingConvention('.class-name-like-this', 'lowercase-dash') );
				assert.equal( true, app.namingConvention('#id-name-like-this', 'lowercase-dash') );
				assert.equal( true, app.namingConvention('.block-{$class-name}', 'lowercase-dash') );
				assert.equal( true, app.namingConvention('#{$class-name}', 'lowercase-dash') );
				assert.equal( true, app.namingConvention('#block-{$class-name}', 'lowercase-dash') );
				assert.equal( true, app.namingConvention(':{$var-name}', 'lowercase-dash') );
				assert.equal( true, app.namingConvention('$varname', 'lowercase-dash') );
				assert.equal( true, app.namingConvention('$varname = "Font Name"', 'lowercase-dash') );

				assert.equal( true, app.namingConvention('$var_name_like_this =', 'lowercase_underscore') );
				assert.equal( true, app.namingConvention('.class_name_like_this', 'lowercase_underscore') );
				assert.equal( true, app.namingConvention('#id_name_like_this', 'lowercase_underscore') );
				assert.equal( true, app.namingConvention('.block_{$var_name}', 'lowercase_underscore') );
				assert.equal( true, app.namingConvention('#{$var_name}', 'lowercase_underscore') );
				assert.equal( true, app.namingConvention('#block_{$var_name}', 'lowercase_underscore') );
				assert.equal( true, app.namingConvention(':{$var_name}', 'lowercase_underscore') );
				assert.equal( true, app.namingConvention('$varname', 'lowercase_underscore') );
				assert.equal( true, app.namingConvention('$varname = "Font Name"', 'lowercase_underscore') );

				assert.equal( true, app.namingConvention('$varNameLikeThis =', 'camelCase') );
				assert.equal( true, app.namingConvention('.classNameLikeThis', 'camelCase') );
				assert.equal( true, app.namingConvention('#idNameLikeThis', 'camelCase') );
				assert.equal( true, app.namingConvention('.block{$varName}', 'camelCase') );
				assert.equal( true, app.namingConvention('#{$varName}', 'camelCase') );
				assert.equal( true, app.namingConvention('#block{$varName}', 'camelCase') );
				assert.equal( true, app.namingConvention(':{$varName}', 'camelCase') );
				assert.equal( true, app.namingConvention('$varname', 'camelCase') );
				assert.equal( true, app.namingConvention('$varname = "Font-name"', 'camelCase') );

				assert.equal( true, app.namingConvention('$var-name__like-this =', 'BEM') );
				assert.equal( true, app.namingConvention('.class-name__like-this', 'BEM') );
				assert.equal( true, app.namingConvention('#id-name__like-this', 'BEM') );
				assert.equal( true, app.namingConvention('.block-{$var__name}', 'BEM') );
				assert.equal( true, app.namingConvention('#{$var__name}', 'BEM') );
				assert.equal( true, app.namingConvention(':{$var__name}', 'BEM') );
				assert.equal( true, app.namingConvention('#block__{$var-name}', 'BEM') );
				assert.equal( true, app.namingConvention('#block{$var-name}', 'BEM') );
				assert.equal( true, app.namingConvention('$varname', 'BEM') );
				assert.equal( true, app.namingConvention('$varname = "Font Name"', 'BEM') );
			});

			it('false if not correct naming convention', function() {
				assert.equal( false, app.namingConvention('$var_name_like_this =', 'lowercase-dash') );
				assert.equal( false, app.namingConvention('.class_name_like_this', 'lowercase-dash') );
				assert.equal( false, app.namingConvention('#id_name_like_this', 'lowercase-dash') );
				assert.equal( false, app.namingConvention('.block_{$var-name}', 'lowercase-dash') );
				assert.equal( false, app.namingConvention('#{$var_name}', 'lowercase-dash') );
				assert.equal( false, app.namingConvention('#block_{$var_name}', 'lowercase-dash') );
				assert.equal( false, app.namingConvention(':{$var_name}', 'lowercase-dash') );
				assert.equal( false, app.namingConvention('.block_{$var-name}', 'lowercase-dash') );

				assert.equal( false, app.namingConvention('$var-name-like-this =', 'lowercase_underscore') );
				assert.equal( false, app.namingConvention('.class-name-like-this', 'lowercase_underscore') );
				assert.equal( false, app.namingConvention('#id-name-like-this', 'lowercase_underscore') );
				assert.equal( false, app.namingConvention('.block-{$var-name}', 'lowercase_underscore') );
				assert.equal( false, app.namingConvention('#{$var-name}', 'lowercase_underscore') );
				assert.equal( false, app.namingConvention('#block-{$var-name}', 'lowercase_underscore') );
				assert.equal( false, app.namingConvention(':{$var-name}', 'lowercase_underscore') );
				assert.equal( false, app.namingConvention('.block-{$varName}', 'lowercase_underscore') );
				assert.equal( false, app.namingConvention('#{$varName}', 'lowercase_underscore') );
				assert.equal( false, app.namingConvention('#block-{$varName}', 'lowercase_underscore') );
				assert.equal( false, app.namingConvention(':{$varName}', 'lowercase_underscore') );
				assert.equal( false, app.namingConvention('.block_{$var-name}', 'lowercase_underscore') );

				assert.equal( false, app.namingConvention('$var-name-like-this =', 'camelCase') );
				assert.equal( false, app.namingConvention('.class-name-like-this', 'camelCase') );
				assert.equal( false, app.namingConvention('#id-name-like-this', 'camelCase') );
				assert.equal( false, app.namingConvention('$var_name_like_this =', 'camelCase') );
				assert.equal( false, app.namingConvention('.class_name_like_this', 'camelCase') );
				assert.equal( false, app.namingConvention('#id_name_like_this', 'camelCase') );
				assert.equal( false, app.namingConvention('.block{$var-name}', 'camelCase') );
				assert.equal( false, app.namingConvention('#{$var-name}', 'camelCase') );
				assert.equal( false, app.namingConvention('#block{$var-name}', 'camelCase') );
				assert.equal( false, app.namingConvention(':{$var-name}', 'camelCase') );
				assert.equal( false, app.namingConvention('.block{$var_name}', 'camelCase') );
				assert.equal( false, app.namingConvention('#{$var_name}', 'camelCase') );
				assert.equal( false, app.namingConvention('#block{$var_name}', 'camelCase') );
				assert.equal( false, app.namingConvention(':{$var_name}', 'camelCase') );
				assert.equal( false, app.namingConvention('.block_{$var-name}', 'camelCase') );

				assert.equal( false, app.namingConvention('.classNameLikeThis', 'BEM') );
				assert.equal( false, app.namingConvention('#id_name_like_this', 'BEM') );
				assert.equal( false, app.namingConvention('.block_{$varName}', 'BEM') );
				assert.equal( false, app.namingConvention('#{$varName}', 'BEM') );
				assert.equal( false, app.namingConvention('#block_{$var-name}', 'BEM') );
				assert.equal( false, app.namingConvention('.block_{$var-name}', 'BEM') );
			});

			it('and undefined if line not checkable', function() {
				assert.equal( undefined, app.namingConvention('$var_name_like_this =', false) );
				assert.equal( undefined, app.namingConvention('.class_name_like_this', false) );
				assert.equal( undefined, app.namingConvention('#id_name_like_this', false) );
				assert.equal( undefined, app.namingConvention('$var-name-like-this =', false) );
				assert.equal( undefined, app.namingConvention('.class-name-like-this', false) );
				assert.equal( undefined, app.namingConvention('#id_name--like-this', false) );
				assert.equal( undefined, app.namingConvention('$var_name--like-this =', false) );
				assert.equal( undefined, app.namingConvention('.class_name--like-this', false) );
				assert.equal( undefined, app.namingConvention('#id-name-like-this', false) );
				assert.equal( undefined, app.namingConvention('margin 0', false) );
				assert.equal( undefined, app.namingConvention('margin 0', 'lowercase-dash') );
				assert.equal( undefined, app.namingConvention('padding inherit', 'camelCase') );
				assert.equal( undefined, app.namingConvention('body ', 'lowercase-underscore') );
				assert.equal( undefined, app.namingConvention() );
				assert.equal( undefined, app.namingConvention('.className') );
				assert.equal( undefined, app.namingConvention('::{$class_name}', 'lowercase-dash') );
				assert.equal( undefined, app.namingConvention('::{$class-name}', 'lowercase_underscore') );
				assert.equal( undefined, app.namingConvention('::{$class_name}', 'camelCase') );
				assert.equal( undefined, app.namingConvention('::{$className}', 'BEM') );
				assert.equal( undefined, app.namingConvention('::{$class_name}', 'BEM') );
				assert.equal( undefined, app.namingConvention('::{$class-name}', 'camelCase') );
				assert.equal( undefined, app.namingConvention('::{$className}', 'lowercase_underscore') );
			});
		});
	});

	describe('naming convention', function() {
		beforeEach(function() {
			app.config.namingConventionStrict = false;
		});

		describe('false', function() {
			it('if strict is false, classes and ids should be undefined as well', function() {
				assert.equal( undefined, app.namingConvention('.class_name_like_this', false) );
				assert.equal( undefined, app.namingConvention('#id_name_like_this', false) );
				assert.equal( undefined, app.namingConvention('.class-name-like-this', false) );
				assert.equal( undefined, app.namingConvention('#id-name-like-this', false) );
				assert.equal( undefined, app.namingConvention('.class-name-like-this', false) );
				assert.equal( undefined, app.namingConvention('#id-name-like-this', false) );
			});
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
			assert.equal( false, app.nesting( test1, test1.split(' '), 4, 4 ) );
			assert.equal( false, app.nesting( test2, test2.split(' '), 4, 4 ) );
		});

		it('should return true if more indents than 2nd param', function() {
			assert.equal( true, app.nesting( test3, test3.split(' '), 1, 4 ) );
			assert.equal( true, app.nesting( test4, test4.split(' '), 2, 2 ) );
			assert.equal( true, app.nesting( test5, test5.split(' '), 4, 4 ) );
			assert.equal( true, app.nesting( test6, test6.split(' '), 4, false ) );
			assert.equal( true, app.nesting( test7, test7.split(' '), 1, false ) );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.nesting( test8, test8.split(' '), undefined, false ) );
			assert.equal( undefined, app.nesting( test8, test8.split(' '), undefined, 4 ) );
			assert.equal( undefined, app.nesting( test8, test8.split(' '), undefined, undefined ) );
			assert.equal( undefined, app.nesting( test8, test8.split(' '), 4, undefined ) );
			assert.equal( undefined, app.nesting( undefined, undefined, 4, undefined ) );
			assert.equal( undefined, app.nesting() );
		});
	});

	describe('paren style', function() {
		it('should return false if no parens spacing found', function() {
			assert.equal( false, app.paren('myMixin(param1, param2)') );
		});

		it('should return true if correct parens spacing found', function() {
			assert.equal( true, app.paren('myMixin( param1, param2 )') );
		});

		it('should return undefined if no parens on line', function() {
			assert.equal( undefined, app.paren('.notAMixin ') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.paren() );
		});
	});

	describe('placeholder style', function() {
		it('should return false if placeholder var not used', function() {
			assert.equal( false, app.placeholder('@extends .notPlaceholderVar') );
		});

		it('should return true if placeholder var is used', function() {
			assert.equal( true, app.placeholder('@extends $placeholderVar') );
		});

		it('should return undefined if no extend found', function() {
			assert.equal( undefined, app.placeholder('margin 0') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.placeholder() );
		});
	});
// .show-content( $content = "Hello!" ) {
	describe('quote style', function() {
		it('should return false if incorrect quote style used', function() {
			assert.equal( false, app.quotes( '$var = "test string" ', 'single' ) );
			assert.equal( false, app.quotes( '$var = "test \'substring\' string"', 'single' ) );
			assert.equal( false, app.quotes( '.show-content( $content = "Hello!" )', 'single' ) );
			assert.equal( false, app.quotes( '.show-content( $content = "Hello!" ) {', 'single' ) );
			assert.equal( false, app.quotes( '[class*="--button"]', 'single' ) );
			assert.equal( false, app.quotes( "$var = 'test string' ", 'double' ) );
			assert.equal( false, app.quotes( "$var = 'test \"substring\" string' ", 'double' ) );
			assert.equal( false, app.quotes( ".show-content( $content = 'Hello!' )", 'double' ) );
			assert.equal( false, app.quotes( ".show-content( $content = 'Hello!' ) {", 'double' ) );
			assert.equal( false, app.quotes( "[class*='--button']", 'double' ) );
		});

		it('should return true if correct quote style used', function() {
			assert.equal( true, app.quotes( "$var = 'test string' ", 'single' ) );
			assert.equal( true, app.quotes( "$var = 'test \"substring\" string' ", 'single' ) );
			assert.equal( true, app.quotes( ".show-content( $content = 'Hello!' )", 'single' ) );
			assert.equal( true, app.quotes( ".show-content( $content = 'Hello!' ) {", 'single' ) );
			assert.equal( true, app.quotes( "[class*='--button']", 'single' ) );
			assert.equal( true, app.quotes( '$var = "test string" ', 'double' ) );
			assert.equal( true, app.quotes( '$var = "test \'substring\' string" ', 'double' ) );
			assert.equal( true, app.quotes( '.show-content( $content = "Hello!" )', 'double' ) );
			assert.equal( true, app.quotes( '.show-content( $content = "Hello!" ) {', 'double' ) );
			assert.equal( true, app.quotes( '[class*="--button"]', 'double' ) );
		});

		it('should return undefined if no quotes found', function() {
			assert.equal( undefined, app.quotes( '$var = #000 ', 'single' ) );
			assert.equal( undefined, app.quotes( '$var = #000 ', 'double' ) );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.quotes( undefined, 'single' ) );
			assert.equal( undefined, app.quotes( undefined, 'double' ) );
			assert.equal( undefined, app.quotes( 'string', undefined ) );
			assert.equal( undefined, app.quotes( 'string', 'incorrect' ) );
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
		it('should return false if no invalid * is found', function() {
			var test = 'return ( $width*$height )',
				test2 = 'content: "*"';

			assert.equal( false, app.universal('img'), ['img'] );
			assert.equal( false, app.universal( test, test.split(' ') ) );
			assert.equal( false, app.universal( test2, test2.split(' ') ) );
		});

		it('should return true if * is found', function() {
			assert.equal( true, app.universal( '*', ['*'] ) );
			assert.equal( true, app.universal( '*:before', ['*:before'] ) );
			assert.equal( true, app.universal( '*::after', ['*::after'] ) );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.universal() );
		});
	});

	describe('valid property', function() {
		it ('should return false if property not valid', function() {
			assert.equal( false, app.valid( 'marg 0 auto', valid ) );
			assert.equal( false, app.valid( 'pad 0', valid ) );
			assert.equal( false, app.valid( 'dog: irish-setter; }', valid ) );
			assert.equal( false, app.valid( '{var name}', valid ) );
			assert.equal( false, app.valid( 'div[attribute test]', valid ) );
			assert.equal( false, app.valid( '::selects', valid ) );
		});

		it ('should return true if property is valid', function() {
			assert.equal( true, app.valid( 'padding 0', valid ) );
			assert.equal( true, app.valid( 'input', valid ) );
			assert.equal( true, app.valid( 'body', valid ) );
			assert.equal( true, app.valid( '$var-name = ', valid ) );
			assert.equal( true, app.valid( '{var-name}', valid ) );
			assert.equal( true, app.valid( 'my-hash = {', valid ) );
			assert.equal( true, app.valid( 'for i in 0..9', valid ) );
			assert.equal( true, app.valid( '&--append-class-name', valid ) );
			assert.equal( true, app.valid( 'div[attribute]', valid ) );
			assert.equal( true, app.valid( '::selection', valid ) );
			assert.equal( true, app.valid( '[data-js]', valid ) );
		});

		it ('should return undefined if missing params', function() {
			assert.equal( undefined, app.valid( undefined, valid ) );
			assert.equal( undefined, app.valid( 'body', undefined ) );
			assert.equal( undefined, app.valid() );
		});
	});

	/**
	 * would like to have this be smarter
	 * ideally it would know whether or not a $ should be used based on context
	 * right now it just checks if $ is used when defining a var and thats it
	 */
	describe('var style check', function() {
		it('should return false if $ is missing', function() {
			assert.equal( false, app.varStyle('myVar = 0') );
		});

		it('should return true if $ is found (and correct', function() {
			assert.equal( true, app.varStyle('$myVar = 0') );
			assert.equal( true, app.varStyle('$first-value = floor( (100% / $columns) * $index )') );
		});

		it('should return undefined if line not testable', function() {
			assert.equal( undefined, app.varStyle('define-my-mixin( $myParam )') );
			assert.equal( undefined, app.varStyle('if($myParam == true)') );
			assert.equal( undefined, app.varStyle('.notAVar') );
			assert.equal( undefined, app.varStyle('if(myParam == true)') );
			assert.equal( undefined, app.varStyle('define-my-mixin( myParam )') );
			assert.equal( undefined, app.varStyle('  use-my-mixin( myParam )') );
			assert.equal( undefined, app.varStyle('  if( $myParam )') );
		});

		it('should return undefined if params missing', function() {
			assert.equal( undefined, app.varStyle() );
		});
	});

	describe('zero units', function() {
		it('should return false if 0 value is fine', function() {
			assert.equal( false, app.zeroUnits('margin 0') );
			assert.equal( false, app.zeroUnits('margin 50px') );
		});

		it('should return true if 0 + any unit type is found (0 is preferred)', function() {
			assert.equal( true, app.zeroUnits('margin 0px') );
			assert.equal( true, app.zeroUnits('margin 0em') );
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

	describe('zIndex Duplicates', function() {
		it('should return false if z-index is not found on line', function() {
			assert.equal( false, app.zIndexDupe('margin 0') );
		});

		it('should return false if z-index is unique', function() {
			assert.equal( false, app.zIndexDupe('z-index 0') );
		});

		it('should return true if z-index is duplicated', function() {
			assert.equal( true, app.zIndexDupe('z-index 0') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.zIndexDupe() );
		});

		it('zCache at this point should be greater than 0', function() {
			assert.equal( true, app.cache.zCache.length > 0 );
		})
	});

	describe('zIndex Normalizer', function() {
		it('should return false if z index value already normalized', function() {
			app.config.zIndexNormalize = 5;
			assert.equal( false, app.zIndexNormalize('z-index 5') );
		});

		it('should return true if z index value needs to be normalized', function() {
			assert.equal( true, app.zIndexNormalize('z-index 4') );
		});

		it('should return undefined if z-index is not found on line', function() {
			assert.equal( undefined, app.zIndexNormalize('margin 0') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, app.zIndexNormalize() );
		});
	});
});
