/**
 * UNIT TESTS
 * lets pull in what we're testing here
 */

const fs = require('fs');
const assert = require('assert');
const should = require('chai').should();
const sinon = require('sinon');
const app = require('../index');
const valid = require('../src/data/getValid')();

// turn on strict mode from this point and turn off logging
// app.state.quiet = true;
app.state.strictMode = true;
app.state.watching = true;
app.state.path = ''; // reset path

describe('State:', function() {
	it('cssBlock should default to false', function() {
		assert.equal( false, app.state.cssBlock );
	});

	it('exitCode should default to 1', function() {
		assert.equal( 1, app.state.exitCode );
	});

	it('hash should default to false', function() {
		assert.equal( false, app.state.hash );
	});

	it('path should default to an empty string', function() {
		assert.equal( '', app.state.path );
	});

	it('strictMode should be true', function() {
		assert.equal( true, app.state.strictMode );
	});

	it('testsEnabled should default to true', function() {
		assert.equal( true, app.state.testsEnabled );
	});

	it('toggleBlock should default to false', function() {
		assert.equal( false, app.state.toggleBlock );
	});
});

describe('Core Methods: ', function() {

	describe('Done: ', function() {
		it('should be a function', function() {
			app.done.should.be.a( 'function' );
		});

		it('exit code should default to 1', function() {
			assert.equal( 1, app.state.exitCode );
		});

		it('should return exit code of 1 if errs', function() {
			app.cache.warnings = [0,1,2,3,4,5];
			assert.equal( 1, app.done( app ).exitCode );
		});
	});

	// describe('Read: ', function() {
	// 	sinon.spy( app, 'read' );

	// 	const dirTest = app.read( app, 'styl/');
	// 	const fileTest = app.read( app, 'styl/test2.styl' );
	// 	const cwdTest = app.read( app, process.cwd() );
	// 	const failTest = app.read( app, 'nonExistantPath' );

	// 	it('should be a function', function() {
	// 		app.read.should.be.a( 'function' );
	// 	});

	// 	it('first param should be the app object', function() {
	// 		assert.deepEqual( app.read.getCall(0).args[0], app );
	// 	});

	// 	it('second param should be a string', function() {
	// 		app.read.getCall(0).args[1].should.be.a( 'string' );
	// 	});

	// 	it('should return parse function if passed a dir', function() {
	// 		app.read.getCall(0).returned( sinon.match.same( app.parse ) );
	// 	});

	// 	it('should return a function if passed a filename', function() {
	// 		app.read.getCall(1).returned( sinon.match.same( app.parse ) );
	// 	});

	// 	it('should return a function if nothing passed', function() {
	// 		app.read.getCall(2).returned( sinon.match.same( app.parse ) );
	// 	});

	// 	it('should return undefined if path doesnt exist', function() {
	// 		assert.equal( undefined, app.read.getCall(3).returnValue );
	// 	});
	// });

	// describe('Parse: ', function() {
	// 	sinon.spy( app, 'parse' );

	// 	const fileTest = app.parse( app, 'styl/test2.styl' );
	// 	const dirTest = app.parse( app, 'styl/');
	// 	const cwdTest = app.read( app, process.cwd() );
	// 	const failTest = app.parse( app, 'nonExistantPath' );

	// 	it('should be a function', function() {
	// 		app.parse.should.be.a( 'function' );
	// 	});

	// 	it('first param should be the app object', function() {
	// 		assert.deepEqual( app.parse.getCall(0).args[0], app );
	// 	});

	// 	it('second param should be a string', function() {
	// 		app.parse.getCall(0).args[1].should.be.a( 'string' );
	// 	});

	// 	it('should return test function if passed a filename', function() {
	// 		app.parse.getCall(0).returned( sinon.match.same( app.test ) );
	// 	});

	// 	it('should return undefined if path is directory', function() {
	// 		assert.equal( undefined, app.parse.getCall(1).returnValue );
	// 	});

	// 	it('should return undefined if path is cwd', function() {
	// 		assert.equal( undefined, app.parse.getCall(2).returnValue );
	// 	});

	// 	it('should return undefined if path doesnt exist', function() {
	// 		assert.equal( undefined, app.parse.getCall(3).returnValue );
	// 	});

	// 	it('should handle empty or one line files fine', function() {
	// 		assert.equal( undefined, app.parse( app, 'styl/oneLine.styl' ) );
	// 	});
	// });

	// describe('Lint: ', function() {
	// 	sinon.spy( app, 'lint' );
	// 	const test = app.lint( app, '  margin 0 auto ', 5, 'margin 0 auto', 'styl/test2.styl' );

	// 	it('should be a function', function() {
	// 		app.lint.should.be.a( 'function' );
	// 	});

	// 	it('first param should be the app object', function() {
	// 		assert.deepEqual( app.lint.getCall(0).args[0], app );
	// 	});

	// 	it('second param should be a string', function() {
	// 		app.lint.getCall(0).args[1].should.be.a( 'string' );
	// 	});

	// 	it('third param should be a number', function() {
	// 		app.lint.getCall(0).args[2].should.be.a( 'number' );
	// 	});

	// 	it('fourth param should be a string', function() {
	// 		app.lint.getCall(0).args[3].should.be.a( 'string' );
	// 	});

	// 	it('fifth param should be a string', function() {
	// 		app.lint.getCall(0).args[4].should.be.a( 'string' );
	// 	});
	// });

	describe('Watch: ', function() {
		sinon.spy( app, 'watch' );
		// call it so we can use spy
		app.watch( app );

		it('should be a function', function() {
			app.watch.should.be.a( 'function' );
		});

		it('first param should be the app object', function() {
			assert.deepEqual( app, app.watch.getCall(0).args[0] );
		});
	});

	describe('Help: ', function() {
		sinon.spy( app, 'help' );
		const test = app.help( app );

		it('should be a function', function() {
			app.help.should.be.a( 'function' );
		});

		it('should return undefined', function() {
			assert.equal( undefined, app.help.getCall(0).returnValue );
		});
	});

	describe('Version: ', function() {
		sinon.spy( app, 'ver' );
		const test = app.ver( app, __dirname );

		it('should be a function', function() {
			app.ver.should.be.a( 'function' );
		});

		it('should return a console log function', function() {
			app.ver.getCall(0).returned( sinon.match.same( console.log ) );
		});
	});

	describe('Set Config Method:', function() {
		const testMethod = app.setConfig( '.stylintrc' );
		const testConfig = JSON.parse( fs.readFileSync( process.cwd() + '/.stylintrc' ) );

		it('should update config state if passed a valid path', function() {
			assert.deepEqual( testMethod, testConfig );
		});

		it('should return undefined if passed invalid path', function() {
			should.Throw(function() {
				app.setConfig( '.nonsenserc' );
			}, Error);
		});
	});

	describe('File parser: ', function() {
		sinon.spy( app, 'getFiles' );
		const test = app.getFiles( '/styl' );

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

	describe('Reset (after change)', function() {
		const resetTest = app.resetOnChange.bind(app);

		beforeEach(function() {
			app.state.watching = false;
		});

		it('reset on change should change dir to curr file', function() {
			resetTest('../styl/_ads.styl');
			assert.equal( true, app.state.path === '../styl/_ads.styl');
		});

		it('reset should reset all caches', function() {
			resetTest('../styl/_ads.styl');
			assert.equal( true,
				app.cache.alphaCache.length === 0 &&
				app.cache.rootCache.length === 0 &&
				app.cache.selectorCache.length === 0 &&
				app.cache.warnings.length === 0 &&
				app.cache.zCache.length === 0
			);
		});

		it('reset should set prevLine and prevFile to empty strings', function() {
			resetTest('../styl/_ads.styl');
			assert.equal( true,
				app.cache.prevLine === '' &&
				app.cache.prevFile === ''
			);
		});

		it('reset should set prevContext to 0', function() {
			resetTest('../styl/_ads.styl');
			assert.equal( true, app.cache.prevContext === 0 );
		});
	});
});

describe('Linter Style Checks: ', function() {
	const lint = app.lintMethods;

	describe('blockStyle: prefer @block when defining block consts', function() {
		const blockTest = lint.blockStyle.bind(app);

		it('false if block style incorrect', function() {
			const test1 = 'myBlock = ';
			const test2 = 'myBlock =';
			assert.equal( false, blockTest(test1) );
			assert.equal( false, blockTest(test2) );
		});

		it('true if block style correct', function() {
			assert.equal( true, blockTest('myBlock = @block') );
			assert.equal( true, blockTest('myBlock = @block ') );
		});

		it('undefined if block style not applicable', function() {
			assert.equal( undefined, blockTest('.class') );
		});
	});

	describe('brackets', function() {
		const bracketsTest = lint.brackets.bind(app);

		it('should return false if bracket found, but not illegal: in hash', function() {
			app.state.hash = true;
			assert.equal( false, bracketsTest('}') );
			assert.equal( false, bracketsTest('{interpolation}') );
			assert.equal( false, bracketsTest('.class-name-with-{i}') );
		});

		it('should return false if bracket found but not illegal: not in a hash', function() {
			app.state.hash = false;
			assert.equal( false, bracketsTest('{interpolation}') );
			assert.equal( false, bracketsTest('.class-name-with-{i}') );
		});

		it('true if illegal bracket found on line (not interpolation, not hash): in hash', function() {
			app.state.hash = true;
			assert.equal( true, bracketsTest('.className {') );
		});

		it('true if illegal bracket found on line (not interpolation, not hash): not in hash', function() {
			app.state.hash = false;
			assert.equal( true, bracketsTest('.className {') );
			assert.equal( true, bracketsTest('.{interpolated}-class {') );
			assert.equal( true, bracketsTest('}') );
		});
	});

	// describe('has comment', function() {
	// 	it ('should return false if // not present at all on line', function() {
	// 		assert.equal( false, lint.commentExists('.noCommentOnThisLine ') );
	// 	});

	// 	it ('should return true if // is present anywhere on the line', function() {
	// 		assert.equal( true, lint.commentExists('//test') );
	// 		assert.equal( true, lint.commentExists('margin 0 auto //test') );
	// 		assert.equal( true, lint.commentExists('margin 0 auto // test') );
	// 		assert.equal( true, lint.commentExists('// test') );
	// 	});

	// 	it ('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.commentExists() );
	// 	});
	// });

	// describe('starts with comment', function() {
	// 	it('should return false if // not first char on line', function() {
	// 		assert.equal( false, lint.startsWithComment('margin 0 auto //test') );
	// 	});

	// 	it('should return true if // is the first character on the line', function() {
	// 		assert.equal( true, lint.startsWithComment('//test') );
	// 		assert.equal( true, lint.startsWithComment(' // test') );
	// 	});

	// 	it ('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.startsWithComment('.noCommentOnThisLine ') );
	// 		assert.equal( undefined, lint.startsWithComment() );
	// 	});
	// });

	describe('colon: prefer margin 0 over margin: 0', function() {
		const colonTest = lint.colons.bind(app);

		it('should return false if no unecessary colons found', function() {
			assert.equal( false, colonTest('margin 0 auto') );
			app.state.hash = true;
			assert.equal( false, colonTest('key: value') );
		});

		it('should return true if unecessary colon is found', function() {
			app.state.hash = false;
			assert.equal( true, colonTest('margin: 0 auto') );
		});
	});

	describe('colors', function () {
		const colorsTest = lint.colors.bind(app);

		it('false if a line doesnt have a hex color', function () {
			assert.equal( false, colorsTest('.foo') );
		});

		it('true if line has hex color', function () {
			assert.equal( true, colorsTest('#fff') );
		});

		it('undefined if hex color is being assigned to a constiable', function () {
			assert.equal( undefined, colorsTest('$foobar ?= #fff') );
			assert.equal( undefined, colorsTest('$foobar = #fff') );
		});

	});

	describe('comma space: prefer space after commas', function() {
		const commaTest = lint.commaSpace.bind(app);

		it('should return false if space after comma, or no comma', function() {
			assert.equal( false, commaTest('0, 0, 0, .18') );
			assert.equal( false, commaTest('margin 0') );
		});

		it('should return false if newline after comma', function() {
			assert.equal( false, commaTest('.className,\n') );
		});

		it('should return true if no space after commas', function() {
			assert.equal( true, commaTest('0,0, 0, .18') );
		});
	});


	describe('comment space: prefer "// Comment" over "//Comment"', function() {
		const commentSpaceTest = lint.commentSpace.bind(app);

		it('should return false if line comment doesnt have a space after it', function() {
			assert.equal( false, commentSpaceTest('//test') );
			assert.equal( false, commentSpaceTest('margin 0 auto //test') );
		});

		it('should return true if line comment has space after it', function() {
			assert.equal( true, commentSpaceTest('// test') );
			assert.equal( true, commentSpaceTest('margin 0 auto // test') );
		});
	});

	describe('css literal', function() {
		const cssTest = lint.cssLiteral.bind(app);

		it('should return false if @css is not used', function() {
			assert.equal( false, cssTest('margin 0') );
			assert.equal( false, cssTest('@extends $placeholderconst') );
			assert.equal( false, cssTest('@require "lint.styl"') );
		});

		it('should return true if @css is used ', function() {
			assert.equal( true, cssTest('@css {') );
		});
	});

	describe('duplicates', function() {
		const dupeTest = lint.duplicates.bind(app);

		beforeEach(function() {
			app.cache.selectorCache = ['margin-bottom', 'margin-top', 'z-index'];
			app.cache.rootCache = ['.test', 'body', '.test2'];
		});

		it('test with tabs on, should return false', function() {
			app.config.indentSpaces = false;
			app.cache.file = 'file.styl';
			assert.equal( false, dupeTest('\t\t.test') );
			app.config.indentSpaces = 4;
		});

		it('should return false if nested selector on multiple files', function() {
			app.config.globalDupe = true;
			app.cache.file = 'file5.styl';
			dupeTest('	.test'); // to set the context
			app.cache.file = 'file6.styl';
			assert.equal( false, dupeTest('	.test') );
			app.config.globalDupe = false;
		});

		it('should return false if previous nested selector was in a list', function() {
			app.cache.file = 'file.styl';
			dupeTest('	.classy,'); // to set the context
			assert.equal( false, dupeTest('	.classy') );
		});

		it('should return false if nested selector is in a list', function() {
			app.cache.file = 'file.styl';
			assert.equal( false, dupeTest('		.class,') );
		});

		it('should return false if previous selector was in a list', function() {
			app.cache.file = 'file.styl';
			dupeTest('.test3,'); // to set the context
			app.cache.file = 'file.styl';
			assert.equal( false, dupeTest('.test3') );
		});

		it('should return false if global dupe off and file changed', function() {
			app.cache.file = 'file.styl';
			dupeTest('.test4'); // to set the context
			app.cache.file = 'file2.styl';
			assert.equal( false, dupeTest('.test4') );
		});

		it('should return true if nested selector is duplicate', function() {
			app.cache.file = 'file.styl';
			dupeTest('   .test'); // to set the context
			app.cache.file = 'file.styl';
			assert.equal( true, dupeTest('   .test') );
		});

		it('should return true if nested selector is duplicate, tab version', function() {
			app.cache.file = 'file.styl';
			dupeTest('	.tab'); // to set the context
			app.cache.file = 'file.styl';
			assert.equal( true, dupeTest('	.tab') );
		});

		it('should return true if root selector is duplicate', function() {
			app.cache.file = 'file.styl';
			dupeTest('.test'); // to set the context
			app.cache.file = 'file.styl';
			assert.equal( true, dupeTest('.test') );
		});

		it('check root selector across several files', function() {
			app.config.globalDupe = true;
			app.cache.file = 'file.styl';
			dupeTest('.test'); // to set the context
			app.cache.file = 'file2.styl';
			assert.equal( true, dupeTest('.test') );
			app.config.globalDupe = false;
		});

		// it('should return undefined if missing params', function() {
		// 	assert.equal( undefined, lint.duplicates() );
		// 	assert.equal( undefined, lint.duplicates( 'test', undefined, app ) );
		// 	assert.equal( undefined, lint.duplicates( undefined, 'file.styl', undefined ) );
		// });
	});

	describe('efficient: prefer margin 0 over margin 0 0 0 0', function() {
		const efficientTest = lint.efficient.bind(app);

		it('should return false if value is not efficient', function() {
			assert.equal( false, efficientTest('margin 0 0 0 0') );
			assert.equal( false, efficientTest('margin 0 0 0') );
			assert.equal( false, efficientTest('margin 0 0') );
			assert.equal( false, efficientTest('margin 0 5px 0 5px') );
			assert.equal( false, efficientTest('margin 5px 0 5px') );
			assert.equal( false, efficientTest('margin 5px 0 5px 0') );
			assert.equal( false, efficientTest('margin 0 5px 0') );
			assert.equal( false, efficientTest('margin 0 5px 5px 5px') );
			assert.equal( false, efficientTest('padding 0 0 0 0') );
			assert.equal( false, efficientTest('padding 0 0 0') );
			assert.equal( false, efficientTest('padding 0 0') );
			assert.equal( false, efficientTest('padding 0 5px 0 5px') );
			assert.equal( false, efficientTest('padding 5px 0 5px') );
			assert.equal( false, efficientTest('padding 5px 0 5px 0') );
			assert.equal( false, efficientTest('padding 0 5px 0') );
			assert.equal( false, efficientTest('padding 0 5px 5px 5px') );
		});

		it('should return true if value is efficient', function() {
			assert.equal( true, efficientTest('margin 0 5px') );
			assert.equal( true, efficientTest('margin: 5px 0') );
			assert.equal( true, efficientTest('margin 5px 0 0') );
			assert.equal( true, efficientTest('margin 0') );
			assert.equal( true, efficientTest('margin 5px') );
			assert.equal( true, efficientTest('padding 0 5px') );
			assert.equal( true, efficientTest('padding 5px 0') );
			assert.equal( true, efficientTest('padding 5px 0 0') );
			assert.equal( true, efficientTest('padding: 0') );
			assert.equal( true, efficientTest('padding 5px') );
			assert.equal( true, efficientTest('padding: 1px 2px 3px 4px') );
		});

		it('should return undefined if nothing to test', function() {
			app.cache.line = 'border 0';
			assert.equal( undefined, efficientTest() );
		});
	});

	describe('extends style: prefer @extends over @extend (or vice versa)', function() {
		const extendTest = lint.extendPref.bind(app);

		it('should return false if value doesnt match preferred style', function() {
			app.config.extendsPref = '@extends';
			assert.equal( false, extendTest('@extend $placeHolderconst') );
			app.config.extendsPref = '@extend';
			assert.equal( false, extendTest('@extends $placeHolderconst') );
		});

		it('should return true if value matches preferred style', function() {
			app.config.extendsPref = '@extend';
			assert.equal( true, extendTest('@extend $placeHolderconst') );
			app.config.extendsPref = '@extends';
			assert.equal( true, extendTest('@extends $placeHolderconst') );
		});

		it('should return undefined if no extend on line', function() {
			assert.equal( undefined, extendTest('$const = #fff') );
		});
	});

	// describe('hash start', function() {
	// 	it('should return false if hash start not found', function() {
	// 		assert.equal( false, lint.hashStart('$myconst =') );
	// 		assert.equal( false, lint.hashStart('myconst = @block') );
	// 		assert.equal( false, lint.hashStart('.mistakenUseOfBracket {') );
	// 		assert.equal( false, lint.hashStart('margin 0') );
	// 	});

	// 	it('should return true if = and { are found on the same line', function() {
	// 		assert.equal( true, lint.hashStart('myHash = {') );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.hashStart() );
	// 	});
	// });

	// describe('hash end', function() {
	// 	it('should return false if hash end not found', function() {
	// 		assert.equal( false, lint.hashEnd('margin 0', true) );
	// 		assert.equal( false, lint.hashEnd('myHash = {', true) );
	// 		assert.equal( false, lint.hashEnd('margin 0', false) );
	// 		assert.equal( false, lint.hashEnd('myHash = {', false) );
	// 		assert.equal( false, lint.hashEnd('}', false) );
	// 	});

	// 	it('should return true if 2nd param is set to true and valid } found', function() {
	// 		assert.equal( true, lint.hashEnd('}', true) );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.hashEnd('}') );
	// 		assert.equal( undefined, lint.hashEnd() );
	// 	});
	// });

	describe('leading zero', function() {
		const zeroTest = lint.leadingZero.bind(app);

		it('should return true if line has a zero before a decimal point and not part of range', function() {
			assert.equal( true, zeroTest('color (0, 0, 0, 0.18)') );
			assert.equal( true, zeroTest('color (0,0,0,0.18)') );
		});

		it('should return false if leading zero not found', function() {
			assert.equal( false, zeroTest('color (0, 0, 0, .18)') );
			assert.equal( false, zeroTest('color (0,0,0,.18)') );
			assert.equal( false, zeroTest('for $ in (0..9)') );
		});
	});

	describe('mixed spaces and tabs', function() {
		const mixed = lint.mixed.bind(app);

		it('should return false if no mixed spaces and tabs found: spaces preferred', function() {
			app.config.indentSpaces = 4;
			assert.equal( false, mixed('    margin 0') );
		});

		it('should return false if no mixed spaces and tabs found: tabs preferred', function() {
			app.config.indentSpaces = false;
			assert.equal( false, mixed('	margin 0') );
		});

		it('should return true if spaces and tabs are mixed: spaces preferred', function() {
			app.config.indentSpaces = 4;
			assert.equal( true, mixed('	  margin 0') );
			assert.equal( true, mixed('	padding 0em') );
		});

		it('should return true if spaces and tabs are mixed: tabs preferred', function() {
			app.config.indentSpaces = false;
			assert.equal( true, mixed('	    margin 0') );
		});
	});

	describe('naming convention: strict true', function() {
		app.config.namingConventionStrict = true;
		const conventionTest = lint.namingConvention.bind(app);

		it('should return false if correct naming convention: lowercase-dash', function() {
			app.config.namingConvention = 'lowercase-dash';
			const test1 = '$const-name-like-this =';
			const test2 = '.class-name-like-this';
			const test3 = '#id-name-like-this';
			const test4 = '.block-{$class-name}';
			const test5 = '#{$class-name}';
			const test6 = '#block-{$class-name}';
			const test7 = ':{$const-name}';
			const test8 = '$constname';
			const test9 = '$constname = "Font Name"';

			app.cache.lineArr = test1.split(' ');
			assert.equal( false, conventionTest('$const-name-like-this =') );
			app.cache.lineArr = test2.split(' ');
			assert.equal( false, conventionTest('.class-name-like-this') );
			app.cache.lineArr = test3.split(' ');
			assert.equal( false, conventionTest('#id-name-like-this') );
			app.cache.lineArr = test4.split(' ');
			assert.equal( false, conventionTest('.block-{$class-name}') );
			app.cache.lineArr = test5.split(' ');
			assert.equal( false, conventionTest('#{$class-name}') );
			app.cache.lineArr = test6.split(' ');
			assert.equal( false, conventionTest('#block-{$class-name}') );
			app.cache.lineArr = test7.split(' ');
			assert.equal( false, conventionTest(':{$const-name}') );
			app.cache.lineArr = test8.split(' ');
			assert.equal( false, conventionTest('$constname') );
			app.cache.lineArr = test9.split(' ');
			assert.equal( false, conventionTest('$constname = "Font Name"') );
		});

		it('should return false if correct naming convention: lowercase_underscore', function() {
			app.config.namingConvention = 'lowercase_underscore';
			const test1 = '$const_name_like_this =';
			const test2 = '.class_name_like_this';
			const test3 = '#id_name_like_this';
			const test4 = '.block_{$class_name}';
			const test5 = '#{$class_name}';
			const test6 = '#block_{$class_name}';
			const test7 = ':{$const_name}';
			const test8 = '$constname';
			const test9 = '$constname = "Font Name"';

			app.cache.lineArr = test1.split(' ');
			assert.equal( false, conventionTest('$const_name_like_this =') );
			app.cache.lineArr = test2.split(' ');
			assert.equal( false, conventionTest('.class_name_like_this') );
			app.cache.lineArr = test3.split(' ');
			assert.equal( false, conventionTest('#id_name_like_this') );
			app.cache.lineArr = test4.split(' ');
			assert.equal( false, conventionTest('.block_{$const_name}') );
			app.cache.lineArr = test5.split(' ');
			assert.equal( false, conventionTest('#{$const_name}') );
			app.cache.lineArr = test6.split(' ');
			assert.equal( false, conventionTest('#block_{$const_name}') );
			app.cache.lineArr = test7.split(' ');
			assert.equal( false, conventionTest(':{$const_name}') );
			app.cache.lineArr = test8.split(' ');
			assert.equal( false, conventionTest('$constname') );
			app.cache.lineArr = test9.split(' ');
			assert.equal( false, conventionTest('$constname = "Font Name"') );
		});

		it('should return false if correct naming convention: camelCase', function() {
			app.config.namingConvention = 'camelCase';
			const test1 = '$constNameLikeThis =';
			const test2 = '.classNameLikeThis';
			const test3 = '#idNameLikeThis';
			const test4 = '.block{$constName}';
			const test5 = '#{$constName}';
			const test6 = '#block{$constName}';
			const test7 = ':{$constName}';
			const test8 = '$constName';
			const test9 = '$constname';
			const test10 = '$constname = "Font Name"';

			app.cache.lineArr = test1.split(' ');
			assert.equal( false, conventionTest('$constNameLikeThis =') );
			app.cache.lineArr = test2.split(' ');
			assert.equal( false, conventionTest('.classNameLikeThis') );
			app.cache.lineArr = test3.split(' ');
			assert.equal( false, conventionTest('#idNameLikeThis') );
			app.cache.lineArr = test4.split(' ');
			assert.equal( false, conventionTest('.block{$constName}') );
			app.cache.lineArr = test5.split(' ');
			assert.equal( false, conventionTest('#{$constName}') );
			app.cache.lineArr = test6.split(' ');
			assert.equal( false, conventionTest('#block{$constName}') );
			app.cache.lineArr = test7.split(' ');
			assert.equal( false, conventionTest(':{$constName}') );
			app.cache.lineArr = test8.split(' ');
			assert.equal( false, conventionTest('$constname') );
			app.cache.lineArr = test9.split(' ');
			assert.equal( false, conventionTest('$constname = "Font-name"') );
		});

		it('should return true if correct naming convention: BEM', function() {
			app.config.namingConvention = 'BEM';
			const test1 = '$const-name__like-this =';
			const test2 = '.class-name__like-this';
			const test3 = '#id-name__like-this';
			const test4 = '.block-{$const__name}';
			const test5 = '#{$const__name}';
			const test6 = ':{$const__name}';
			const test7 = '#block__{$const-name}';
			const test8 = '#block{$const-name}';
			const test9 = '$constname';
			const test10 = '$constname = "Font Name"';

			app.cache.lineArr = test1.split(' ');
			assert.equal( false, conventionTest('$const-name__like-this =') );
			app.cache.lineArr = test2.split(' ');
			assert.equal( false, conventionTest('.class-name__like-this') );
			app.cache.lineArr = test3.split(' ');
			assert.equal( false, conventionTest('#id-name__like-this') );
			app.cache.lineArr = test4.split(' ');
			assert.equal( false, conventionTest('.block-{$const__name}') );
			app.cache.lineArr = test5.split(' ');
			assert.equal( false, conventionTest('#{$const__name}') );
			app.cache.lineArr = test6.split(' ');
			assert.equal( false, conventionTest(':{$const__name}') );
			app.cache.lineArr = test7.split(' ');
			assert.equal( false, conventionTest('#block__{$const-name}') );
			app.cache.lineArr = test8.split(' ');
			assert.equal( false, conventionTest('#block{$const-name}') );
			app.cache.lineArr = test9.split(' ');
			assert.equal( false, conventionTest('$constname') );
			app.cache.lineArr = test10.split(' ');
			assert.equal( false, conventionTest('$constname = "Font Name"') );
		});

		it('true if not correct naming convention: lowercase-dash', function() {
			app.config.namingConvention = 'lowercase-dash';
			const test1 = '$const_name_like_this =';
			const test2 = '.class_name_like_this';
			const test3 = '#id_name_like_this';
			const test4 = '.block_{$const-name}';
			const test5 = '#{$const_name}';
			const test6 = '#block_{$const_name}';
			const test7 = ':{$const_name}';
			const test8 = '.block_{$const-name}';

			app.cache.lineArr = test1.split(' ');
			assert.equal( true, conventionTest(test1) );
			app.cache.lineArr = test2.split(' ');
			assert.equal( true, conventionTest(test2) );
			app.cache.lineArr = test3.split(' ');
			assert.equal( true, conventionTest(test3) );
			app.cache.lineArr = test4.split(' ');
			assert.equal( true, conventionTest(test4) );
			app.cache.lineArr = test5.split(' ');
			assert.equal( true, conventionTest(test5) );
			app.cache.lineArr = test6.split(' ');
			assert.equal( true, conventionTest(test6) );
			app.cache.lineArr = test7.split(' ');
			assert.equal( true, conventionTest(test7) );
			app.cache.lineArr = test8.split(' ');
			assert.equal( true, conventionTest(test8) );
		});

		it('true if not correct naming convention: lowercase_underscore', function() {
			app.config.namingConvention = 'lowercase_underscore';
			const test1 = '$const-name-like-this =';
			const test2 = '.class-name-like-this';
			const test3 = '#id-name-like-this';
			const test4 = '.block-{$const-name}';
			const test5 = '#{$const-name}';
			const test6 = '#block-{$const-name}';
			const test7 = ':{$const-name}';
			const test8 = '.block-{$constName}';
			const test9 = '#{$constName}';
			const test10 = '#block-{$constName}';
			const test11 = ':{$constName}';
			const test12 = '.block_{$const-name}';

			app.cache.lineArr = test1.split(' ');
			assert.equal( true, conventionTest('$const-name-like-this =') );
			app.cache.lineArr = test2.split(' ');
			assert.equal( true, conventionTest('.class-name-like-this') );
			app.cache.lineArr = test3.split(' ');
			assert.equal( true, conventionTest('#id-name-like-this') );
			app.cache.lineArr = test4.split(' ');
			assert.equal( true, conventionTest('.block-{$const-name}') );
			app.cache.lineArr = test5.split(' ');
			assert.equal( true, conventionTest('#{$const-name}') );
			app.cache.lineArr = test6.split(' ');
			assert.equal( true, conventionTest('#block-{$const-name}') );
			app.cache.lineArr = test7.split(' ');
			assert.equal( true, conventionTest(':{$const-name}') );
			app.cache.lineArr = test8.split(' ');
			assert.equal( true, conventionTest('.block-{$constName}') );
			app.cache.lineArr = test9.split(' ');
			assert.equal( true, conventionTest('#{$constName}') );
			app.cache.lineArr = test10.split(' ');
			assert.equal( true, conventionTest('#block-{$constName}') );
			app.cache.lineArr = test11.split(' ');
			assert.equal( true, conventionTest(':{$constName}') );
			app.cache.lineArr = test12.split(' ');
			assert.equal( true, conventionTest('.block_{$const-name}') );
		});

		it('true if not correct naming convention: camelCase', function() {
			app.config.namingConvention = 'camelCase';
			const test1 = '$const-name-like-this =';
			const test2 = '.class-name-like-this';
			const test3 = '#id-name-like-this';
			const test4 = '$const_name_like_this =';
			const test5 = '.class_name_like_this';
			const test6 = '#id_name_like_this';
			const test7 = '.block{$const-name}';
			const test8 = '#{$const-name}';
			const test9 = '.block{$const_name}';
			const test10 = '#{$const_name}';
			const test11 = '.block{$const-name}';
			const test12 = '#{$const-name}';
			const test13 = ':{$const-name}';
			const test14 = '.block_{$const-name}';
			const test15 = '#block{$const-name}';

			app.cache.lineArr = test1.split(' ');
			assert.equal( true, conventionTest('$const-name-like-this =') );
			app.cache.lineArr = test2.split(' ');
			assert.equal( true, conventionTest('.class-name-like-this') );
			app.cache.lineArr = test3.split(' ');
			assert.equal( true, conventionTest('#id-name-like-this') );
			app.cache.lineArr = test4.split(' ');
			assert.equal( true, conventionTest('$const_name_like_this =') );
			app.cache.lineArr = test5.split(' ');
			assert.equal( true, conventionTest('.class_name_like_this') );
			app.cache.lineArr = test6.split(' ');
			assert.equal( true, conventionTest('#id_name_like_this') );
			app.cache.lineArr = test7.split(' ');
			assert.equal( true, conventionTest('.block{$const-name}') );
			app.cache.lineArr = test8.split(' ');
			assert.equal( true, conventionTest('#{$const-name}') );
			app.cache.lineArr = test9.split(' ');
			assert.equal( true, conventionTest('#block{$const-name}') );
			app.cache.lineArr = test10.split(' ');
			assert.equal( true, conventionTest(':{$const-name}') );
			app.cache.lineArr = test11.split(' ');
			assert.equal( true, conventionTest('.block{$const_name}') );
			app.cache.lineArr = test12.split(' ');
			assert.equal( true, conventionTest('#{$const_name}') );
			app.cache.lineArr = test13.split(' ');
			assert.equal( true, conventionTest('#block{$const_name}') );
			app.cache.lineArr = test14.split(' ');
			assert.equal( true, conventionTest(':{$const_name}') );
			app.cache.lineArr = test15.split(' ');
			assert.equal( true, conventionTest('.block_{$const-name}') );
		});

		it('true if not correct naming convention: BEM', function() {
			app.config.namingConvention = 'BEM';
			const test1 = '.classNameLikeThis';
			const test2 = '#id_name_like_this';
			const test3 = '.block_{$constName}';
			const test4 = '#{$constName}';
			const test5 = '#block_{$const-name}';
			const test6 = '.block_{$const-name}';

			app.cache.lineArr = test1.split(' ');
			assert.equal( true, conventionTest('.classNameLikeThis') );
			app.cache.lineArr = test2.split(' ');
			assert.equal( true, conventionTest('#id_name_like_this') );
			app.cache.lineArr = test3.split(' ');
			assert.equal( true, conventionTest('.block_{$constName}') );
			app.cache.lineArr = test4.split(' ');
			assert.equal( true, conventionTest('#{$constName}') );
			app.cache.lineArr = test5.split(' ');
			assert.equal( true, conventionTest('#block_{$const-name}') );
			app.cache.lineArr = test6.split(' ');
			assert.equal( true, conventionTest('.block_{$const-name}') );
		});
	});

	describe('naming convention: strict false', function() {
		app.config.namingConventionStrict = false;

		it('should return false if using classes or ids', function() {
			const test1 = '.class_name_like_this';
			const test2 = '#id_name_like_this';
			const test3 = '.class-name-like-this';
			const test4 = '#id-name-like-this';
			const test5 = '.class-name-like-this';
			const test6 = '#id-name-like-this';

			app.cache.lineArr = test1.split(' ');
			assert.equal( false, conventionTest('.class_name_like_this') );
			app.cache.lineArr = test2.split(' ');
			assert.equal( false, conventionTest('#id_name_like_this') );
			app.cache.lineArr = test3.split(' ');
			assert.equal( false, conventionTest('.class-name-like-this') );
			app.cache.lineArr = test4.split(' ');
			assert.equal( false, conventionTest('#id-name-like-this') );
			app.cache.lineArr = test5.split(' ');
			assert.equal( false, conventionTest('.class-name-like-this') );
			app.cache.lineArr = test6.split(' ');
			assert.equal( false, conventionTest('#id-name-like-this') );
		});
	});

	describe('depthLimit', function() {
		const nestTest = lint.depthLimit.bind(app);

		it('should return false if less indents than depth limit', function() {
			app.config.depthLimit = 4;
			app.config.indentPref = 4;
			assert.equal( false, nestTest('margin 0') );
			assert.equal( false, nestTest('			margin 0') );
			app.config.indentPref = 'tabs';
			assert.equal( false, nestTest('&:hover') );
			assert.equal( false, nestTest('.class-name') );
		});

		it('should return true if more indents than depth limit', function() {
			app.config.depthLimit = 2;
			app.config.indentPref = 2;
			assert.equal( true, nestTest('       margin 0') );
			app.config.indentPref = 4;
			assert.equal( true, nestTest('          margin 0') );
			app.config.depthLimit = 4;
			assert.equal( true, nestTest('                   margin 0') );
			app.config.indentPref = 'tabs';
			assert.equal( true, nestTest('					margin 0') );
			app.config.depthLimit = 1;
			assert.equal( true, nestTest('		margin 0 )') );
		});
	});

	describe('keyframes end', function() {
		const keyframesEndTest = lint.keyframesEnd.bind(app);

		it('should return true if keyframes active and context set to 0', function() {
			app.state.keyframes = true;
			assert.equal( true, keyframesEndTest('.newClass') );
		});

		it('should return false if line doesnt have a context of zero', function() {
			assert.equal( false, keyframesEndTest('		from {') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, keyframesEndTest() );
		});
	});

	describe('keyframes start', function() {
		const keyframesStartTest = lint.keyframesStart.bind(app);

		it('should return true if line has @keyframes', function() {
			assert.equal( true, keyframesStartTest('@keyframes {') );
		});

		it('should return false if line isnt a start of @keyframes', function() {
			assert.equal( false, keyframesStartTest('margin 0') );
		});

		it('should return undefined if missing params', function() {
			assert.equal( undefined, keyframesStartTest() );
		});
	});

	describe('noNone: prefer 0 over none', function() {
		const noneTest = lint.noNone.bind(app);

		it('should return false if border none not present', function() {
			app.cache.line = 'border 0';
			assert.equal( false, noneTest() );
			app.cache.line = 'border: 0';
			assert.equal( false, noneTest() );
			app.cache.line = 'border:0';
			assert.equal( false, noneTest() );
		});

		it('should return false if no outline none found', function() {
			app.cache.line = 'outline 0';
			assert.equal( false, noneTest() );
			app.cache.line = 'outline: 0';
			assert.equal( false, noneTest() );
			app.cache.line = 'outline:0';
			assert.equal( false, noneTest() );
		});

		it('should return true if border none is present', function() {
			app.cache.line = 'border none';
			assert.equal( true, noneTest() );
			app.cache.line = 'border: none';
			assert.equal( true, noneTest() );
			app.cache.line = 'border:none';
			assert.equal( true, noneTest() );
		});

		it('should return true if outline none found', function() {
			app.cache.line = 'outline none';
			assert.equal( true, noneTest() );
			app.cache.line = 'outline: none';
			assert.equal( true, noneTest() );
			app.cache.line = 'outline:none';
			assert.equal( true, noneTest() );
		});
	});

	describe('paren style', function() {
		const parenTest = lint.parenSpace.bind(app);

		it('should return false if no parens spacing found', function() {
			assert.equal( false, parenTest('myMixin(param1, param2)') );
		});

		it('should return false if no parens on line', function() {
			assert.equal( true, parenTest('.notAMixin ') );
		});

		it('should return true if correct parens spacing found', function() {
			assert.equal( true, parenTest('myMixin( param1, param2 )') );
		});
	});

	describe('placeholder style', function() {
		const placeholderTest = lint.placeholders.bind(app);

		it('should return false if placeholder const not used', function() {
			assert.equal( false, placeholderTest('@extend .notPlaceholderconst') );
			assert.equal( false, placeholderTest('@extends .notPlaceholderconst') );
		});

		it('should return false if @extend by itself', function() {
			assert.equal( false, placeholderTest('@extend$placeholderconst') );
			assert.equal( false, placeholderTest('@extends') );
		});

		it('should return true if no extend found', function() {
			assert.equal( true, placeholderTest('margin 0') );
		});

		it('should return true if placeholder const is used', function() {
			assert.equal( true, placeholderTest('@extends $placeholderconst') );
			assert.equal( true, placeholderTest('@extend $placeholderconst') );
		});
	});

	describe('quote style', function() {
		const quoteTest = lint.quotePref.bind(app);

		it('false if correct quote style used: single', function() {
			app.config.quotePref = 'single';
			assert.equal( false, quoteTest("$const = 'test string' ") );
			assert.equal( false, quoteTest("$const = 'test \"substring\" string' ") );
			assert.equal( false, quoteTest(".show-content( $content = 'Hello!' )") );
			assert.equal( false, quoteTest(".show-content( $content = 'Hello!' ) {") );
			assert.equal( false, quoteTest("[class*='--button']") );
			assert.equal( false, quoteTest("[class*='--button'] {") );
			assert.equal( false, quoteTest("show-content( $content = 'Hello!' ) {") );
		});

		it('false if correct quote style used: double', function() {
			app.config.quotePref = 'double';
			assert.equal( false, quoteTest('$const = "test string" ') );
			assert.equal( false, quoteTest('$const = "test \'substring\' string"') );
			assert.equal( false, quoteTest('.show-content( $content = "Hello!" )') );
			assert.equal( false, quoteTest('.show-content( $content = "Hello!" ) {') );
			assert.equal( false, quoteTest('[class*="--button"]') );
			assert.equal( false, quoteTest('[class*="--button"] {') );
			assert.equal( false, quoteTest('show-content( $content = "Hello!" ) {') );
		});

		it('false if no quotes found', function() {
			app.config.quotePref = 'double';
			assert.equal( false, quoteTest('$const = #000 ') );
			app.config.quotePref = 'single';
			assert.equal( false, quoteTest('$const = #000 ') );
		});

		it('true if incorrect quote style used: single', function() {
			app.config.quotePref = 'single';
			assert.equal( true, quoteTest('$const = "test string" ') );
			assert.equal( true, quoteTest('$const = "test \'substring\' string"') );
			assert.equal( true, quoteTest('.show-content( $content = "Hello!" )') );
			assert.equal( true, quoteTest('.show-content( $content = "Hello!" ) {') );
			assert.equal( true, quoteTest('[class*="--button"]') );
		});

		it('true if incorrect quote style used: double', function() {
			app.config.quotePref = 'double';
			assert.equal( true, quoteTest("$const = 'test string' ") );
			assert.equal( true, quoteTest("$const = 'test \"substring\" string' ") );
			assert.equal( true, quoteTest(".show-content( $content = 'Hello!' )") );
			assert.equal( true, quoteTest(".show-content( $content = 'Hello!' ) {") );
			assert.equal( true, quoteTest("[class*='--button']") );
		});
	});

	describe('semicolon', function() {
		const semiTest = lint.semicolons.bind(app);

		it('should return false if no semicolon is found', function() {
			assert.equal( false, semiTest('margin 0 auto') );
		});

		it('should return true if semicolon found', function() {
			assert.equal( true, semiTest('margin 0 auto;') );
		});
	});

	describe('stacked properties', function() {
		const stackedTest = lint.stackedProperties.bind(app);

		it('should return false if not a one liner', function() {
			assert.equal( false, stackedTest('margin 0 auto') );
		});

		it('should return true if one liner', function() {
			assert.equal( true, stackedTest('margin 0 auto; padding: 5px;') );
			assert.equal( true, stackedTest('margin 0 auto; padding: 5px;') );
		});
	});

	describe('sort order', function() {
		const sortTest = lint.sortOrder.bind(app);
		const indent = ' ';

		beforeEach(function() {
			app.cache.prevContext = indent.length / app.config.indentSpaces;
		});

		it('should ignore root level properties', function() {
			app.cache.sortOrderCache = [ 'border', 'margin', 'padding' ];

			assert.equal( 3, app.cache.sortOrderCache.length );
			assert.equal( true, sortTest( 'z-index', valid, app.config.sortOrder ));
			assert.equal( 0, app.cache.sortOrderCache.length );
		});

		describe('disabled', function() {
			beforeEach(function() {
				app.config.sortOrder = false;
			});

			it('should allow any order when disabled', function() {
				const expectedCache = [ 'background', 'z-index', 'border', 'width' ];

				assert.equal( false, app.config.sortOrder );
				assert.equal( true, sortTest( indent + 'background', valid, app.config.sortOrder ) );
				assert.equal( true, sortTest( indent + 'z-index', valid, app.config.sortOrder ) );
				assert.equal( true, sortTest( indent + 'border', valid, app.config.sortOrder ) );
				assert.equal( true, sortTest( indent + 'width', valid, app.config.sortOrder ) );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});
		});

		describe('alphabetical', function() {
			beforeEach(function() {
				app.config.sortOrder = 'alphabetical';
				app.cache.sortOrderCache = [ 'border', 'margin', 'padding' ];
			});

			it('should return true if correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'border', 'margin', 'padding', 'position', 'z-index' ];

				assert.equal( 'alphabetical', app.config.sortOrder );
				assert.equal( 3, app.cache.sortOrderCache.length );
				assert.equal( true, sortTest( indent + 'position', valid, app.config.sortOrder ) );
				assert.equal( true, sortTest( indent + 'z-index', valid, app.config.sortOrder ) );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});

			it('false if not correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'border', 'margin', 'padding', 'line-height', 'background' ];

				assert.equal( 'alphabetical', app.config.sortOrder );
				assert.equal( 3, app.cache.sortOrderCache.length );
				assert.equal( false, sortTest( indent + 'line-height', valid, app.config.sortOrder ) );
				assert.equal( false, sortTest( indent + 'background', valid, app.config.sortOrder ) );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});
		});

		describe('grouped', function() {
			beforeEach(function() {
				app.config.sortOrder = 'grouped';
				app.cache.sortOrderCache = [ 'position', 'right' ];
			});

			it('should return true if correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'position', 'right', 'bottom', 'z-index', 'width' ];

				assert.equal( 'grouped', app.config.sortOrder );
				assert.equal( 2, app.cache.sortOrderCache.length );
				assert.equal( true, sortTest( indent + 'bottom', valid, app.config.sortOrder ) );
				assert.equal( true, sortTest( indent + 'z-index', valid, app.config.sortOrder ) );
				assert.equal( true, sortTest( indent + 'width', valid, app.config.sortOrder ) );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});

			it('false if not correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'position', 'right', 'top' ];

				assert.equal( 'grouped', app.config.sortOrder );
				assert.equal( 2, app.cache.sortOrderCache.length );
				assert.equal( false, sortTest( indent + 'top', valid, app.config.sortOrder ) );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});
		});

		describe('Array', function() {
			beforeEach(function() {
				app.config.sortOrder = [ 'z-index', 'animation', 'top' ];
				app.cache.sortOrderCache = [ 'z-index' ];
			});

			it('should return true if correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'z-index', 'animation', 'top', 'width', 'border' ];

				assert.deepEqual( [ 'z-index', 'animation', 'top' ], app.config.sortOrder );
				assert.equal( 1, app.cache.sortOrderCache.length );
				assert.equal( true, sortTest( indent + 'animation', valid, app.config.sortOrder ) );
				assert.equal( true, sortTest( indent + 'top', valid, app.config.sortOrder ) );
				assert.equal( true, sortTest( indent + 'width', valid, app.config.sortOrder ) );
				assert.equal( true, sortTest( indent + 'border', valid, app.config.sortOrder ) );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});

			it('false if not correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'z-index', 'top', 'animation' ];

				assert.deepEqual( [ 'z-index', 'animation', 'top' ], app.config.sortOrder );
				assert.equal( 1, app.cache.sortOrderCache.length );
				assert.equal( true, sortTest( indent + 'top', valid, app.config.sortOrder ) );
				assert.equal( false, sortTest( indent + 'animation', valid, app.config.sortOrder ) );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});
		});
	});

	describe('trailing whitespace', function() {
		const whitespaceTest = lint.trailingWhitespace.bind(app);

		it('should return false if no trailing whitespace', function() {
			assert.equal( false, whitespaceTest('margin 0 auto') );
		});

		it('should return true if whitespace found', function() {
			assert.equal( true, whitespaceTest('margin 0 auto	') );
			assert.equal( true, whitespaceTest('margin 0 auto ') );
		});
	});

	describe('universal selector', function() {
		const universalTest = lint.universal.bind(app);

		it('should return false if no invalid * is found', function() {
			assert.equal( false, universalTest('img') );
			assert.equal( false, universalTest('return ( $width*$height )') );
			assert.equal( false, universalTest('content: "*"') );
		});

		it('should return true if * is found', function() {
			assert.equal( true, universalTest('*') );
			assert.equal( true, universalTest('*:before') );
			assert.equal( true, universalTest('*::after') );
		});
	});

	describe('valid property: check is css property is valid', function() {
		const validTest = lint.valid.bind(app);

		it ('should return false if property not valid', function() {
			assert.equal( false, validTest( 'marg 0 auto') );
			assert.equal( false, validTest( 'pad 0') );
			assert.equal( false, validTest( 'dog: irish-setter; }') );
			assert.equal( false, validTest( '{const name}') );
			assert.equal( false, validTest( 'div[attribute test]') );
			assert.equal( false, validTest( '::selects') );
		});

		it ('should return true if property is valid', function() {
			assert.equal( true, validTest( 'padding 0') );
			assert.equal( true, validTest( '-webkit-border-radius 0') );
			assert.equal( true, validTest( '.el:hover') );
			assert.equal( true, validTest( 'input') );
			assert.equal( true, validTest( 'body') );
			assert.equal( true, validTest( '$const-name = ') );
			assert.equal( true, validTest( '{const-name}') );
			assert.equal( true, validTest( 'my-hash = {') );
			assert.equal( true, validTest( 'for i in 0..9') );
			assert.equal( true, validTest( '&--append-class-name') );
			assert.equal( true, validTest( 'div[attribute]') );
			assert.equal( true, validTest( '::selection') );
			assert.equal( true, validTest( 'div:hover') );
			assert.equal( true, validTest( '#id:hover') );
			assert.equal( true, validTest( 'p:optional') );
			assert.equal( true, validTest( '[data-js]') );
		});
	});

	/**
	 * would like to have this be smarter
	 * ideally it would know whether or not a $ should be used based on context
	 * right now it just checks if $ is used when defining a const and thats it
	 */
	describe('const style check', function() {
		const constTest = lint.varStyle.bind(app);

		it('should return false if $ is missing', function() {
			assert.equal( false, constTest('myconst = 0') );
		});

		it('should return false if $ if block const', function() {
			assert.equal( false, constTest('myconst = @block') );
		});

		it('should return true if $ is found (and correct', function() {
			assert.equal( true, constTest('$myconst = 0') );
			assert.equal( true, constTest('$first-value = floor( (100% / $columns) * $index )') );
		});
	});

	describe('zero units', function() {
		const zeroTest = lint.zeroUnits.bind(app);

		it('should return false if 0 value is fine', function() {
			app.state.keyframes = false;
			assert.equal( false, zeroTest('margin 0') );
			assert.equal( false, zeroTest('margin 50px') );
		});

		it('should return true if 0 + any unit type is found (0 is preferred)', function() {
			assert.equal( true, zeroTest('margin 0px') );
			assert.equal( true, zeroTest('margin 0em') );
			assert.equal( true, zeroTest('margin 0rem') );
			assert.equal( true, zeroTest('margin 0pt') );
			assert.equal( true, zeroTest('margin 0pc') );
			assert.equal( true, zeroTest('margin 0vh') );
			assert.equal( true, zeroTest('margin 0vw') );
			assert.equal( true, zeroTest('margin 0vmin') );
			assert.equal( true, zeroTest('margin 0vmax') );
			assert.equal( true, zeroTest('margin 0mm') );
			assert.equal( true, zeroTest('margin 0cm') );
			assert.equal( true, zeroTest('margin 0in') );
			assert.equal( true, zeroTest('margin 0mozmm') );
			assert.equal( true, zeroTest('margin 0ex') );
			assert.equal( true, zeroTest('margin 0ch') );
		});

		it('should return undefined if in keyframes', function() {
			app.state.keyframes = true;
			assert.equal( undefined, zeroTest('from 0%') );
			assert.equal( undefined, zeroTest('0% {') );
			app.state.keyframes = false;
		});
	});

	describe('zIndex Duplicates', function() {
		const zDupeTest = lint.zIndexDuplicates.bind(app);

		it('should return false if z-index is not found on line', function() {
			assert.equal( false, zDupeTest('margin 0') );
		});

		it('should return false if z-index is unique', function() {
			assert.equal( false, zDupeTest('z-index 0') );
		});

		it('should return true if z-index is duplicated', function() {
			assert.equal( true, zDupeTest('z-index 0') );
		});

		it('zCache at this point should be greater than 0', function() {
			assert.equal( true, app.cache.zCache.length > 0 );
		})
	});

	describe('zIndex Normalizer', function() {
		const zNormalizrTest = lint.zIndexNormalize.bind(app);

		it('should return false if z index value already normalized', function() {
			app.config.zIndexNormalize = 5;
			assert.equal( false, zNormalizrTest('z-index 5') );
			assert.equal( false, zNormalizrTest('margin 0') );
		});

		it('should return true if z index value needs to be normalized', function() {
			assert.equal( true, zNormalizrTest('z-index 4') );
		});
	});
});

// describe('Done, again: ', function() {
// 	app.state.warnings = [];

// 	it('exit code should be 0 if no errs', function() {
// 		app.cache.warnings = [];
// 		assert.equal( 0, app.done( app ).exitCode );
// 	});

// 	it('should return an object', function() {
// 		assert.equal( true, typeof app.done( app ) === 'object' );
// 	});

// 	it('which should have a string as the 1st property', function() {
// 		assert.equal( true, typeof app.done( app ).msg === 'string' );
// 	});

// 	it('which should have an array as the 2nd property', function() {
// 		assert.equal( true, typeof app.done( app ).warnings.forEach !== 'undefined' );
// 	});

// 	it('msg should be the success message', function() {
// 		const success = app.emojiAllClear() + 'Stylint: You\'re all clear!';
// 		assert.equal( success, app.done( app ).msg );
// 	});

// 	it('msg should be the kill message', function() {
// 		// passing in kill should kill the linter no matter how many errs there are
// 		const kill = '\n0 Warnings\nStylint: too many errors, exiting';
// 		assert.equal( kill, app.done( app, 'kill' ).msg );
// 	});

// 	it('msg should be the too many errors message', function() {
// 		app.cache.warnings = [0,1,2,3,4,5,6,7,8,9,10];
// 		const tooMany = app.emojiWarning() + 'Stylint: ' + app.cache.warnings.length + ' warnings. Max is set to: ' + app.config.maxWarnings;
// 		assert.equal( tooMany, app.done( app ).msg );
// 	});

// 	it('msg should be the default errors message', function() {
// 		app.cache.warnings = [0,1,2,3,4,5];
// 		const initial = '\n' + app.emojiWarning() + app.cache.warnings.length + ' Warnings';
// 		assert.equal( initial, app.done( app ).msg );
// 	});

// 	it('should output faked errors', function() {
// 		app.cache.warnings = [0,1,2,3,4,5];
// 		app.state.quiet = false;
// 		app.done( app );
// 		app.state.quiet = true;
// 	});

	// it('should exit if watch off', function() {
	// 	sinon.spy( app, 'done' );
	// 	const test;

	// 	app.state.watching = false;
	// 	test = app.done( app );

	// 	app.done.getCall(0).returned( sinon.match.same( process.exit ) );
	// 	app.state.watching = true;
	// });
// });
