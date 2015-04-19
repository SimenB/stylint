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
		const fileTest = app.watch( app, 'styl/test2.styl' );

		it('should be a function', function() {
			app.watch.should.be.a( 'function' );
		});

		it('should return undefined', function() {
			assert.equal( undefined, app.watch() );
			assert.equal( undefined, app.watch( 'something' ) );
			assert.equal( undefined, app.watch( 'something', {} ) );
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

		it('reset on change should change dir to curr file', function() {
			app.resetOnChange('./styl/_ads.styl');
			assert.equal( true, app.state.dir === './styl/_ads.styl');
		});

		it('reset should reset all caches', function() {
			app.resetOnChange('./styl/_ads.styl');
			assert.equal( true,
				app.cache.alphaCache.length === 0 &&
				app.cache.rootCache.length === 0 &&
				app.cache.selectorCache.length === 0 &&
				app.cache.warnings.length === 0 &&
				app.cache.zCache.length === 0
			);
		});

		it('reset should set prevLine and prevFile to empty strings', function() {
			app.resetOnChange('./styl/_ads.styl');
			assert.equal( true,
				app.cache.prevLine === '' &&
				app.cache.prevFile === ''
			);
		});

		it('reset should set prevContext to 0', function() {
			assert.equal( true, app.cache.prevContext === 0 );
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

		it('should return undefined if dir not string', function() {
			assert.equal( undefined, app.ver( app, 0 ) );
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
});

// describe('Flags:', function() {
// 	const defaultFlags = [
// 		'-c',
// 		'-w',
// 		'-s',
// 		'-v',
// 		'-h',
// 		'--config',
// 		'--watch',
// 		'--strict',
// 		'--version',
// 		'--help',
// 		'--harmony'
// 	];

// 	it('should deep equal mocked default flags', function() {
// 		assert.deepEqual( app.flags, defaultFlags );
// 	});
// });

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

	it('path should default to undefined', function() {
		assert.equal( undefined, app.state.path );
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

describe('Linter Style Checks: ', function() {
	var lint = app.lintMethods;

	describe('blockStyle: prefer @block when defining block vars', function() {
		beforeEach(function() {
			blockTest = app.lintMethods.blockStyle.bind(app);
		});

		it('should return false if block style incorrect', function() {
			app.cache.line = 'myBlock = ';
			assert.equal( false, blockTest() );
			app.cache.line = 'myBlock =';
			assert.equal( false, blockTest() );
		});

		it('should return true if block style correct', function() {
			app.cache.line = 'myBlock = @block';
			assert.equal( true, blockTest() );
			app.cache.line = 'myBlock = @block ';
			assert.equal( true, blockTest() );
		});
	});

	describe('brackets', function() {
		beforeEach(function() {
			bracketsTest = app.lintMethods.brackets.bind(app);
		});

		it('should return false if bracket found, but not illegal: in hash', function() {
			app.state.hash = true;
			app.cache.line = '}';
			assert.equal( false, bracketsTest() );
			app.cache.line = '{interpolation}';
			assert.equal( false, bracketsTest() );
			app.cache.line = '.class-name-with-{i}';
			assert.equal( false, bracketsTest() );
		});

		it('should return false if bracket found but not illegal: not in a hash', function() {
			app.state.hash = false;
			app.cache.line = '{interpolation}';
			assert.equal( false, bracketsTest() );
			app.cache.line = '.class-name-with-{i}';
			assert.equal( false, bracketsTest() );
		});

		it('true if illegal bracket found on line (not interpolation, not hash): in hash', function() {
			app.state.hash = true;
			app.cache.line = '.className {';
			assert.equal( true, bracketsTest() );
		});

		it('true if illegal bracket found on line (not interpolation, not hash): not in hash', function() {
			app.state.hash = false;
			app.cache.line = '.className {';
			assert.equal( true, bracketsTest() );
			app.cache.line = '.{interpolated}-class {';
			assert.equal( true, bracketsTest() );
			app.cache.line = '}';
			assert.equal( true, bracketsTest() );
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

	describe('comma space: prefer "// Comment" over "//Comment"', function() {
		beforeEach(function() {
			commentSpaceTest = app.lintMethods.commentSpace.bind(app);
		});

		it('should return false if line comment doesnt have a space after it', function() {
			app.cache.line = '//test';
			assert.equal( false, commentSpaceTest() );
			app.cache.line = 'margin 0 auto //test';
			assert.equal( false, commentSpaceTest() );
		});

		it('should return true if line comment has space after it', function() {
			app.cache.line = '// test';
			assert.equal( true, commentSpaceTest() );
			app.cache.line = 'margin 0 auto // test';
			assert.equal( true, commentSpaceTest() );
		});
	});

	describe('colon: prefer margin 0 over margin: 0', function() {
		beforeEach(function() {
			colonTest = app.lintMethods.colons.bind(app);
		});

		it('should return false if no unecessary colons found', function() {
			app.cache.line = 'margin 0 auto';
			assert.equal( false, colonTest() );
			app.cache.line = 'key: value';
			app.state.hash = true;
			assert.equal( false, colonTest() );
		});

		it('should return true if unecessary colon is found', function() {
			app.cache.line = 'margin: 0 auto';
			app.state.hash = false;
			assert.equal( true, colonTest() );
		});
	});

	describe('colors', function () {
		beforeEach(function() {
			colorsTest = app.lintMethods.colors.bind(app);
		});

		it('should return false if a line doesnt have a hex color', function () {
			app.cache.line = '.foo';
			assert.equal( false, colorsTest() );
		});

		it('should return false if hex color is assigned to a variable', function () {
			app.cache.line = '$foobar ?= #fff';
			assert.equal( false, colorsTest() );
		});

		it('should return true if line has hex color', function () {
			app.cache.line = '#fff';
			assert.equal( true, colorsTest() );
		});
	});

	describe('comma style', function() {
		beforeEach(function() {
			commaTest = app.lintMethods.commaSpace.bind(app);
		});

		it('should return false if no space after commas', function() {
			app.cache.line = '0,0, 0, .18';
			assert.equal( false, commaTest() );
		});

		it('should return true if space after comma, or no comma', function() {
			app.cache.line = '0, 0, 0, .18';
			assert.equal( true, commaTest() );
			app.cache.line = 'margin 0';
			assert.equal( true, commaTest() );
		});

		it('should return true if newline after comma', function() {
			app.cache.line = '.className,\n';
			assert.equal( true, commaTest() );
		});
	});

	describe('css literal', function() {
		beforeEach(function() {
			cssTest = app.lintMethods.cssLiteral.bind(app);
		});

		it('should return false if @css is not used', function() {
			app.cache.line = 'margin 0';
			assert.equal( false, cssTest() );
			app.cache.line = '@extends $placeholderVar';
			assert.equal( false, cssTest() );
			app.cache.line = '@require "lint.styl"';
			assert.equal( false, cssTest() );
		});

		it('should return true if @css is used ', function() {
			app.cache.line = '@css {'
			assert.equal( true, cssTest() );
		});
	});

	// describe('duplicates', function() {

	// 	beforeEach(function() {
	// 		app.cache.selectorCache = ['margin-bottom', 'margin-top', 'z-index'];
	// 		app.cache.rootCache = ['.test', 'body', '.test2'];
	// 	});

	// 	it('test with tabs on, should return false', function() {
	// 		app.config.indentSpaces = false;
	// 		assert.equal( false, lint.duplicates( '\t\t.test', 'file.styl', app ) );
	// 		app.config.indentSpaces = 4;
	// 	});

	// 	it('should return false if nested selector on multiple files', function() {
	// 		app.config.globalDupe = true;
	// 		lint.duplicates( '	.test', 'file5.styl', app ); // to set the context
	// 		assert.equal( false, lint.duplicates( '	.test', 'file6.styl', app ) );
	// 		app.config.globalDupe = false;
	// 	});

	// 	it('should return false if previous nested selector was in a list', function() {
	// 		lint.duplicates( '	.classy,', 'file.styl', app ); // to set the context
	// 		assert.equal( false, lint.duplicates( '	.classy', 'file.styl', app ) );
	// 	});

	// 	it('should return false if nested selector is in a list', function() {
	// 		assert.equal( false, lint.duplicates( '		.class,', 'file.styl', app ) );
	// 	});

	// 	it('should return false if previous selector was in a list', function() {
	// 		lint.duplicates( '.test3,', 'file.styl', app ); // to set the context
	// 		assert.equal( false, lint.duplicates( '.test3', 'file.styl', app ) );
	// 	});

	// 	it('should return false if global dupe off and file changed', function() {
	// 		lint.duplicates( '.test4', 'file.styl', app ); // to set the context
	// 		assert.equal( false, lint.duplicates( '.test4', 'file2.styl', app ) );
	// 	});

	// 	it('should return true if nested selector is duplicate', function() {
	// 		lint.duplicates( '   .test', 'file.styl', app ); // to set the context
	// 		assert.equal( true, lint.duplicates( '   .test', 'file.styl', app ) );
	// 	});

	// 	it('should return true if nested selector is duplicate, tab version', function() {
	// 		lint.duplicates( '	.tab', 'file.styl', app ); // to set the context
	// 		assert.equal( true, lint.duplicates( '	.tab', 'file.styl', app ) );
	// 	});

	// 	it('should return true if root selector is duplicate', function() {
	// 		lint.duplicates( '.test', 'file.styl', app ); // to set the context
	// 		assert.equal( true, lint.duplicates( '.test', 'file.styl', app ) );
	// 	});

	// 	it('check root selector across several files', function() {
	// 		app.config.globalDupe = true;
	// 		lint.duplicates( '.test', 'file.styl', app ); // to set the context
	// 		assert.equal( true, lint.duplicates( '.test', 'file2.styl', app ) );
	// 		app.config.globalDupe = false;
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.duplicates() );
	// 		assert.equal( undefined, lint.duplicates( 'test', undefined, app ) );
	// 		assert.equal( undefined, lint.duplicates( undefined, 'file.styl', undefined ) );
	// 	});
	// });

	describe('efficient: prefer margin 0 over margin 0 0 0 0', function() {
		beforeEach(function() {
			efficientTest = app.lintMethods.efficient.bind(app);
		});

		it('should return false if value is not efficient', function() {
			app.cache.line = 'margin 0 0 0 0';
			assert.equal( false, efficientTest() );
			app.cache.line = 'margin 0 0 0';
			assert.equal( false, efficientTest() );
			app.cache.line = 'margin 0 0';
			assert.equal( false, efficientTest() );
			app.cache.line = 'margin 0 5px 0 5px';
			assert.equal( false, efficientTest() );
			app.cache.line = 'margin 5px 0 5px';
			assert.equal( false, efficientTest() );
			app.cache.line = 'margin 5px 0 5px 0';
			assert.equal( false, efficientTest() );
			app.cache.line = 'margin 0 5px 0';
			assert.equal( false, efficientTest() );
			app.cache.line = 'margin 0 5px 5px 5px';
			assert.equal( false, efficientTest() );
			app.cache.line = 'padding 0 0 0 0';
			assert.equal( false, efficientTest() );
			app.cache.line = 'padding 0 0 0';
			assert.equal( false, efficientTest() );
			app.cache.line = 'padding 0 0';
			assert.equal( false, efficientTest() );
			app.cache.line = 'padding 0 5px 0 5px';
			assert.equal( false, efficientTest() );
			app.cache.line = 'padding 5px 0 5px';
			assert.equal( false, efficientTest() );
			app.cache.line = 'padding 5px 0 5px 0';
			assert.equal( false, efficientTest() );
			app.cache.line = 'padding 0 5px 0';
			assert.equal( false, efficientTest() );
			app.cache.line = 'padding 0 5px 5px 5px';
			assert.equal( false, efficientTest() );
		});

		it('should return true if value is efficient', function() {
			app.cache.line = 'margin 0 5px';
			assert.equal( true, efficientTest() );
			app.cache.line = 'margin: 5px 0';
			assert.equal( true, efficientTest() );
			app.cache.line = 'margin 5px 0 0';
			assert.equal( true, efficientTest() );
			app.cache.line = 'margin 0';
			assert.equal( true, efficientTest() );
			app.cache.line = 'margin 5px';
			assert.equal( true, efficientTest() );
			app.cache.line = 'padding 0 5px';
			assert.equal( true, efficientTest() );
			app.cache.line = 'padding 5px 0';
			assert.equal( true, efficientTest() );
			app.cache.line = 'padding 5px 0 0';
			assert.equal( true, efficientTest() );
			app.cache.line = 'padding: 0';
			assert.equal( true, efficientTest() );
			app.cache.line = 'padding 5px';
			assert.equal( true, efficientTest() );
			app.cache.line = 'padding: 1px 2px 3px 4px';
			assert.equal( true, efficientTest() );
		});

		it('should return undefined if nothing to test', function() {
			app.cache.line = 'border 0';
			assert.equal( undefined, efficientTest() );
		});
	});

	describe('extends style: prefer @extends over @extend (or vice versa)', function() {
		beforeEach(function() {
			extendTest = app.lintMethods.extendPref.bind(app);
		});

		it('should return false if value doesnt match preferred style', function() {
			app.config.extendsPref = '@extends';
			app.cache.line = '@extend $placeHolderVar';
			assert.equal( false, extendTest() );
			app.config.extendsPref = '@extend';
			app.cache.line = '@extends $placeHolderVar';
			assert.equal( false, extendTest() );
		});

		it('should return true if value matches preferred style', function() {
			app.config.extendsPref = '@extend';
			app.cache.line = '@extend $placeHolderVar';
			assert.equal( true, extendTest() );
			app.config.extendsPref = '@extends';
			app.cache.line = '@extends $placeHolderVar';
			assert.equal( true, extendTest() );
		});

		it('should return undefined if no extend on line', function() {
			app.cache.line = '$var = #fff';
			assert.equal( undefined, extendTest() );
		});
	});

	// describe('hash start', function() {
	// 	it('should return false if hash start not found', function() {
	// 		assert.equal( false, lint.hashStart('$myVar =') );
	// 		assert.equal( false, lint.hashStart('myVar = @block') );
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

	// describe('leading zero', function() {
	// 	var test1 = 'color (0, 0, 0, 0.18)';
	// 	var test2 = 'color (0,0,0,0.18)';
	// 	var test3 = 'color (0, 0, 0, .18)';
	// 	var test4 = 'color (0,0,0,.18)';
	// 	var test5 = 'for $ in (0..9)';

	// 	it('should return true if line has a zero before a decimal point and not part of range', function() {
	// 		assert.equal( true, lint.leadingZero( test1, test1.split(' ') ) );
	// 		assert.equal( true, lint.leadingZero( test2, test2.split(' ') ) );
	// 	});

	// 	it('should return false if leading zero not found', function() {
	// 		assert.equal( false, lint.leadingZero( test3, test3.split(' ') ) );
	// 		assert.equal( false, lint.leadingZero( test4, test4.split(' ') ) );
	// 		assert.equal( false, lint.leadingZero( test5, test5.split(' ') ) );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.leadingZero() );
	// 	});
	// });

	// describe('mixed spaces and tabs', function() {
	// 	it('should return false if no mixed spaces and tabs found', function() {
	// 		var test1 = '    margin 0';
	// 		var test2 = '	margin 0';

	// 		assert.equal( false, lint.mixed( test1, test1.split(' '), 4 ) );
	// 		assert.equal( false, lint.mixed( test2, test2.split(' '), false ) );
	// 	});

	// 	it('should return true if spaces and tabs are mixed', function() {
	// 		var test1 = '	  margin 0';
	// 		var test2 = '	    margin 0';
	// 		var test3 = '	padding 0em';

	// 		assert.equal( true, lint.mixed( test1, test1.split(' '), 4 ) );
	// 		assert.equal( true, lint.mixed( test2, test2.split(' '), false ) );
	// 		assert.equal( true, lint.mixed( test3, test3.split(' '), 4 ) );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.mixed() );
	// 	});
	// });

	// describe('naming convention', function() {
	// 	beforeEach(function() {
	// 		app.config.namingConventionStrict = true;
	// 	});

	// 	describe('strict', function() {
	// 		it('should return true if correct naming convention', function() {
	// 			assert.equal( true, lint.namingConvention('$var-name-like-this =', 'lowercase-dash') );
	// 			assert.equal( true, lint.namingConvention('.class-name-like-this', 'lowercase-dash') );
	// 			assert.equal( true, lint.namingConvention('#id-name-like-this', 'lowercase-dash') );
	// 			assert.equal( true, lint.namingConvention('.block-{$class-name}', 'lowercase-dash') );
	// 			assert.equal( true, lint.namingConvention('#{$class-name}', 'lowercase-dash') );
	// 			assert.equal( true, lint.namingConvention('#block-{$class-name}', 'lowercase-dash') );
	// 			assert.equal( true, lint.namingConvention(':{$var-name}', 'lowercase-dash') );
	// 			assert.equal( true, lint.namingConvention('$varname', 'lowercase-dash') );
	// 			assert.equal( true, lint.namingConvention('$varname = "Font Name"', 'lowercase-dash') );

	// 			assert.equal( true, lint.namingConvention('$var_name_like_this =', 'lowercase_underscore') );
	// 			assert.equal( true, lint.namingConvention('.class_name_like_this', 'lowercase_underscore') );
	// 			assert.equal( true, lint.namingConvention('#id_name_like_this', 'lowercase_underscore') );
	// 			assert.equal( true, lint.namingConvention('.block_{$var_name}', 'lowercase_underscore') );
	// 			assert.equal( true, lint.namingConvention('#{$var_name}', 'lowercase_underscore') );
	// 			assert.equal( true, lint.namingConvention('#block_{$var_name}', 'lowercase_underscore') );
	// 			assert.equal( true, lint.namingConvention(':{$var_name}', 'lowercase_underscore') );
	// 			assert.equal( true, lint.namingConvention('$varname', 'lowercase_underscore') );
	// 			assert.equal( true, lint.namingConvention('$varname = "Font Name"', 'lowercase_underscore') );

	// 			assert.equal( true, lint.namingConvention('$varNameLikeThis =', 'camelCase') );
	// 			assert.equal( true, lint.namingConvention('.classNameLikeThis', 'camelCase') );
	// 			assert.equal( true, lint.namingConvention('#idNameLikeThis', 'camelCase') );
	// 			assert.equal( true, lint.namingConvention('.block{$varName}', 'camelCase') );
	// 			assert.equal( true, lint.namingConvention('#{$varName}', 'camelCase') );
	// 			assert.equal( true, lint.namingConvention('#block{$varName}', 'camelCase') );
	// 			assert.equal( true, lint.namingConvention(':{$varName}', 'camelCase') );
	// 			assert.equal( true, lint.namingConvention('$varname', 'camelCase') );
	// 			assert.equal( true, lint.namingConvention('$varname = "Font-name"', 'camelCase') );

	// 			assert.equal( true, lint.namingConvention('$var-name__like-this =', 'BEM') );
	// 			assert.equal( true, lint.namingConvention('.class-name__like-this', 'BEM') );
	// 			assert.equal( true, lint.namingConvention('#id-name__like-this', 'BEM') );
	// 			assert.equal( true, lint.namingConvention('.block-{$var__name}', 'BEM') );
	// 			assert.equal( true, lint.namingConvention('#{$var__name}', 'BEM') );
	// 			assert.equal( true, lint.namingConvention(':{$var__name}', 'BEM') );
	// 			assert.equal( true, lint.namingConvention('#block__{$var-name}', 'BEM') );
	// 			assert.equal( true, lint.namingConvention('#block{$var-name}', 'BEM') );
	// 			assert.equal( true, lint.namingConvention('$varname', 'BEM') );
	// 			assert.equal( true, lint.namingConvention('$varname = "Font Name"', 'BEM') );
	// 		});

	// 		it('false if not correct naming convention', function() {
	// 			assert.equal( false, lint.namingConvention('$var_name_like_this =', 'lowercase-dash') );
	// 			assert.equal( false, lint.namingConvention('.class_name_like_this', 'lowercase-dash') );
	// 			assert.equal( false, lint.namingConvention('#id_name_like_this', 'lowercase-dash') );
	// 			assert.equal( false, lint.namingConvention('.block_{$var-name}', 'lowercase-dash') );
	// 			assert.equal( false, lint.namingConvention('#{$var_name}', 'lowercase-dash') );
	// 			assert.equal( false, lint.namingConvention('#block_{$var_name}', 'lowercase-dash') );
	// 			assert.equal( false, lint.namingConvention(':{$var_name}', 'lowercase-dash') );
	// 			assert.equal( false, lint.namingConvention('.block_{$var-name}', 'lowercase-dash') );

	// 			assert.equal( false, lint.namingConvention('$var-name-like-this =', 'lowercase_underscore') );
	// 			assert.equal( false, lint.namingConvention('.class-name-like-this', 'lowercase_underscore') );
	// 			assert.equal( false, lint.namingConvention('#id-name-like-this', 'lowercase_underscore') );
	// 			assert.equal( false, lint.namingConvention('.block-{$var-name}', 'lowercase_underscore') );
	// 			assert.equal( false, lint.namingConvention('#{$var-name}', 'lowercase_underscore') );
	// 			assert.equal( false, lint.namingConvention('#block-{$var-name}', 'lowercase_underscore') );
	// 			assert.equal( false, lint.namingConvention(':{$var-name}', 'lowercase_underscore') );
	// 			assert.equal( false, lint.namingConvention('.block-{$varName}', 'lowercase_underscore') );
	// 			assert.equal( false, lint.namingConvention('#{$varName}', 'lowercase_underscore') );
	// 			assert.equal( false, lint.namingConvention('#block-{$varName}', 'lowercase_underscore') );
	// 			assert.equal( false, lint.namingConvention(':{$varName}', 'lowercase_underscore') );
	// 			assert.equal( false, lint.namingConvention('.block_{$var-name}', 'lowercase_underscore') );

	// 			assert.equal( false, lint.namingConvention('$var-name-like-this =', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('.class-name-like-this', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('#id-name-like-this', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('$var_name_like_this =', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('.class_name_like_this', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('#id_name_like_this', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('.block{$var-name}', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('#{$var-name}', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('#block{$var-name}', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention(':{$var-name}', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('.block{$var_name}', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('#{$var_name}', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('#block{$var_name}', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention(':{$var_name}', 'camelCase') );
	// 			assert.equal( false, lint.namingConvention('.block_{$var-name}', 'camelCase') );

	// 			assert.equal( false, lint.namingConvention('.classNameLikeThis', 'BEM') );
	// 			assert.equal( false, lint.namingConvention('#id_name_like_this', 'BEM') );
	// 			assert.equal( false, lint.namingConvention('.block_{$varName}', 'BEM') );
	// 			assert.equal( false, lint.namingConvention('#{$varName}', 'BEM') );
	// 			assert.equal( false, lint.namingConvention('#block_{$var-name}', 'BEM') );
	// 			assert.equal( false, lint.namingConvention('.block_{$var-name}', 'BEM') );
	// 		});

	// 		it('and undefined if line not checkable', function() {
	// 			assert.equal( undefined, lint.namingConvention('$var_name_like_this =', false) );
	// 			assert.equal( undefined, lint.namingConvention('.class_name_like_this', false) );
	// 			assert.equal( undefined, lint.namingConvention('#id_name_like_this', false) );
	// 			assert.equal( undefined, lint.namingConvention('$var-name-like-this =', false) );
	// 			assert.equal( undefined, lint.namingConvention('.class-name-like-this', false) );
	// 			assert.equal( undefined, lint.namingConvention('#id_name--like-this', false) );
	// 			assert.equal( undefined, lint.namingConvention('$var_name--like-this =', false) );
	// 			assert.equal( undefined, lint.namingConvention('.class_name--like-this', false) );
	// 			assert.equal( undefined, lint.namingConvention('#id-name-like-this', false) );
	// 			assert.equal( undefined, lint.namingConvention('margin 0', false) );
	// 			assert.equal( undefined, lint.namingConvention('margin 0', 'lowercase-dash') );
	// 			assert.equal( undefined, lint.namingConvention('padding inherit', 'camelCase') );
	// 			assert.equal( undefined, lint.namingConvention('body ', 'lowercase-underscore') );
	// 			assert.equal( undefined, lint.namingConvention() );
	// 			assert.equal( undefined, lint.namingConvention('.className') );
	// 			assert.equal( undefined, lint.namingConvention('::{$class_name}', 'lowercase-dash') );
	// 			assert.equal( undefined, lint.namingConvention('::{$class-name}', 'lowercase_underscore') );
	// 			assert.equal( undefined, lint.namingConvention('::{$class_name}', 'camelCase') );
	// 			assert.equal( undefined, lint.namingConvention('::{$className}', 'BEM') );
	// 			assert.equal( undefined, lint.namingConvention('::{$class_name}', 'BEM') );
	// 			assert.equal( undefined, lint.namingConvention('::{$class-name}', 'camelCase') );
	// 			assert.equal( undefined, lint.namingConvention('::{$className}', 'lowercase_underscore') );
	// 		});
	// 	});
	// });

	// describe('naming convention', function() {
	// 	beforeEach(function() {
	// 		app.config.namingConventionStrict = false;
	// 	});

	// 	describe('false', function() {
	// 		it('if strict is false, classes and ids should be undefined as well', function() {
	// 			assert.equal( undefined, lint.namingConvention('.class_name_like_this', false) );
	// 			assert.equal( undefined, lint.namingConvention('#id_name_like_this', false) );
	// 			assert.equal( undefined, lint.namingConvention('.class-name-like-this', false) );
	// 			assert.equal( undefined, lint.namingConvention('#id-name-like-this', false) );
	// 			assert.equal( undefined, lint.namingConvention('.class-name-like-this', false) );
	// 			assert.equal( undefined, lint.namingConvention('#id-name-like-this', false) );
	// 		});
	// 	});
	// });

	// describe('nesting', function() {
	// 	var test1 = 'margin 0';
	// 	var test2 = '			margin 0';
	// 	var test3 = '          margin 0';
	// 	var test4 = '       margin 0';
	// 	var test5 = '                   margin 0';
	// 	var test6 = '					margin 0';
	// 	var test7 = '		margin 0 )';
	// 	var test8 = '       margin 0 )';
	// 	var test9 = '&:hover';
	// 	var test10 = '.class-name';

	// 	it('should return false if less indents than 2nd param', function() {
	// 		assert.equal( false, lint.nesting( test1, test1.split(' '), 4, 4 ) );
	// 		assert.equal( false, lint.nesting( test2, test2.split(' '), 4, 4 ) );
	// 		assert.equal( false, lint.nesting( test9, test9.split(' '), 4, false ) );
	// 		assert.equal( false, lint.nesting( test10, test10.split(' '), 4, false ) );
	// 	});

	// 	it('should return true if more indents than 2nd param', function() {
	// 		assert.equal( true, lint.nesting( test3, test3.split(' '), 1, 4 ) );
	// 		assert.equal( true, lint.nesting( test4, test4.split(' '), 2, 2 ) );
	// 		assert.equal( true, lint.nesting( test5, test5.split(' '), 4, 4 ) );
	// 		assert.equal( true, lint.nesting( test6, test6.split(' '), 4, false ) );
	// 		assert.equal( true, lint.nesting( test7, test7.split(' '), 1, false ) );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.nesting( test8, test8.split(' '), undefined, false ) );
	// 		assert.equal( undefined, lint.nesting( test8, test8.split(' '), undefined, 4 ) );
	// 		assert.equal( undefined, lint.nesting( test8, test8.split(' '), undefined, undefined ) );
	// 		assert.equal( undefined, lint.nesting( test8, test8.split(' '), 4, undefined ) );
	// 		assert.equal( undefined, lint.nesting( undefined, undefined, 4, undefined ) );
	// 		assert.equal( undefined, lint.nesting() );
	// 	});
	// });

	// describe('outline none', function() {
	// 	it('should return false if no outline none found', function() {
	// 		assert.equal( false, lint.outlineNone('outline 0') );
	// 		assert.equal( false, lint.outlineNone('outline: 0') );
	// 	});

	// 	it('should return true if outline none found', function() {
	// 		assert.equal( true, lint.outlineNone('outline none') );
	// 		assert.equal( true, lint.outlineNone('outline: none') );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.outlineNone() );
	// 	});
	// });

	describe('noNone: prefer 0 over none', function() {
		beforeEach(function() {
			noneTest = app.lintMethods.noNone.bind(app);
		});

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

	// describe('paren style', function() {
	// 	it('should return false if no parens spacing found', function() {
	// 		assert.equal( false, lint.paren('myMixin(param1, param2)') );
	// 	});

	// 	it('should return true if correct parens spacing found', function() {
	// 		assert.equal( true, lint.paren('myMixin( param1, param2 )') );
	// 	});

	// 	it('should return undefined if no parens on line', function() {
	// 		assert.equal( undefined, lint.paren('.notAMixin ') );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.paren() );
	// 	});
	// });

	// describe('placeholder style', function() {
	// 	it('should return false if placeholder var not used', function() {
	// 		assert.equal( false, lint.placeholder('@extend .notPlaceholderVar') );
	// 		assert.equal( false, lint.placeholder('@extends .notPlaceholderVar') );
	// 	});

	// 	it('should return false if @extend by itself', function() {
	// 		assert.equal( false, lint.placeholder('@extend$placeholderVar') );
	// 		assert.equal( false, lint.placeholder('@extends') );
	// 	});

	// 	it('should return true if placeholder var is used', function() {
	// 		assert.equal( true, lint.placeholder('@extends $placeholderVar') );
	// 		assert.equal( true, lint.placeholder('@extend $placeholderVar') );
	// 	});

	// 	it('should return undefined if no extend found', function() {
	// 		assert.equal( undefined, lint.placeholder('margin 0') );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.placeholder() );
	// 	});
	// });

	// describe('quote style', function() {
	// 	it('should return false if correct quote style used', function() {
	// 		assert.equal( false, lint.quotes( '$var = "test string" ', 'single' ) );
	// 		assert.equal( false, lint.quotes( '$var = "test \'substring\' string"', 'single' ) );
	// 		assert.equal( false, lint.quotes( '.show-content( $content = "Hello!" )', 'single' ) );
	// 		assert.equal( false, lint.quotes( '.show-content( $content = "Hello!" ) {', 'single' ) );
	// 		assert.equal( false, lint.quotes( '[class*="--button"]', 'single' ) );
	// 		assert.equal( false, lint.quotes( '[class*="--button"] {', 'single' ) );
	// 		assert.equal( false, lint.quotes( 'show-content( $content = "Hello!" ) {', 'single' ) );
	// 		assert.equal( false, lint.quotes( "$var = 'test string' ", 'double' ) );
	// 		assert.equal( false, lint.quotes( "$var = 'test \"substring\" string' ", 'double' ) );
	// 		assert.equal( false, lint.quotes( ".show-content( $content = 'Hello!' )", 'double' ) );
	// 		assert.equal( false, lint.quotes( ".show-content( $content = 'Hello!' ) {", 'double' ) );
	// 		assert.equal( false, lint.quotes( "[class*='--button']", 'double' ) );
	// 		assert.equal( false, lint.quotes( "[class*='--button'] {", 'double' ) );
	// 		assert.equal( false, lint.quotes( "show-content( $content = 'Hello!' ) {", 'double' ) );
	// 	});

	// 	it('should return false if no quotes found', function() {
	// 		assert.equal( false, lint.quotes( '$var = #000 ', 'single' ) );
	// 		assert.equal( false, lint.quotes( '$var = #000 ', 'double' ) );
	// 	});

	// 	it('should return true if incorrect quote style used', function() {
	// 		assert.equal( true, lint.quotes( '$var = "test string" ', 'single' ) );
	// 		assert.equal( true, lint.quotes( '$var = "test \'substring\' string"', 'single' ) );
	// 		assert.equal( true, lint.quotes( '.show-content( $content = "Hello!" )', 'single' ) );
	// 		assert.equal( true, lint.quotes( '.show-content( $content = "Hello!" ) {', 'single' ) );
	// 		assert.equal( true, lint.quotes( '[class*="--button"]', 'single' ) );
	// 		assert.equal( true, lint.quotes( "$var = 'test string' ", 'double' ) );
	// 		assert.equal( true, lint.quotes( "$var = 'test \"substring\" string' ", 'double' ) );
	// 		assert.equal( true, lint.quotes( ".show-content( $content = 'Hello!' )", 'double' ) );
	// 		assert.equal( true, lint.quotes( ".show-content( $content = 'Hello!' ) {", 'double' ) );
	// 		assert.equal( true, lint.quotes( "[class*='--button']", 'double' ) );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.quotes( undefined, 'single' ) );
	// 		assert.equal( undefined, lint.quotes( undefined, 'double' ) );
	// 		assert.equal( undefined, lint.quotes( 'string', undefined ) );
	// 	});
	// });

	// describe('semicolon', function() {
	// 	it('should return false if no semicolon is found', function() {
	// 		assert.equal( false, lint.semicolon('margin 0 auto') );
	// 	});

	// 	it('should return true if semicolon found', function() {
	// 		assert.equal( true, lint.semicolon('margin 0 auto;') );
	// 	});

	// 	it('should return undefined if params missing', function() {
	// 		assert.equal( undefined, lint.semicolon() );
	// 	});
	// });

	// describe('stacked properties', function() {
	// 	it('should return false if not a one liner', function() {
	// 		assert.equal( false, lint.stackedProperties('margin 0 auto') );
	// 	});

	// 	it('should return true if one liner', function() {
	// 		assert.equal( true, lint.stackedProperties('margin 0 auto; padding: 5px;') );
	// 		assert.equal( true, lint.stackedProperties('margin 0 auto; padding: 5px;') );
	// 	});

	// 	it('should return undefined if params missing', function() {
	// 		assert.equal( undefined, lint.stackedProperties() );
	// 	});
	// });

	// describe('sort order', function() {
	// 	var indent = ' ';

	// 	beforeEach(function() {
	// 		app.cache.prevContext = indent.length / app.config.indentSpaces;
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.sortOrder( undefined, valid, undefined ) );
	// 		assert.equal( undefined, lint.sortOrder( undefined, valid ) );
	// 		assert.equal( undefined, lint.sortOrder( 'z-index' ) );
	// 		assert.equal( undefined, lint.sortOrder() );
	// 	});

	// 	it('should ignore root level properties', function() {
	// 		app.cache.sortOrderCache = [ 'border', 'margin', 'padding' ];

	// 		assert.equal( 3, app.cache.sortOrderCache.length );
	// 		assert.equal( true, lint.sortOrder( 'z-index', valid, app.config.sortOrder ));
	// 		assert.equal( 0, app.cache.sortOrderCache.length );
	// 	});

	// 	describe('disabled', function() {
	// 		beforeEach(function() {
	// 			app.config.sortOrder = false;
	// 		});

	// 		it('should allow any order when disabled', function() {
	// 			var expectedCache = [ 'background', 'z-index', 'border', 'width' ];

	// 			assert.equal( false, app.config.sortOrder );
	// 			assert.equal( true, lint.sortOrder( indent + 'background', valid, app.config.sortOrder ) );
	// 			assert.equal( true, lint.sortOrder( indent + 'z-index', valid, app.config.sortOrder ) );
	// 			assert.equal( true, lint.sortOrder( indent + 'border', valid, app.config.sortOrder ) );
	// 			assert.equal( true, lint.sortOrder( indent + 'width', valid, app.config.sortOrder ) );
	// 			assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
	// 			assert.deepEqual( expectedCache, app.cache.sortOrderCache );
	// 		});
	// 	});

	// 	describe('alphabetical', function() {
	// 		beforeEach(function() {
	// 			app.config.sortOrder = 'alphabetical';
	// 			app.cache.sortOrderCache = [ 'border', 'margin', 'padding' ];
	// 		});

	// 		it('should return true if correct sort order with mocked sort order cache', function() {
	// 			var expectedCache = [ 'border', 'margin', 'padding', 'position', 'z-index' ];

	// 			assert.equal( 'alphabetical', app.config.sortOrder );
	// 			assert.equal( 3, app.cache.sortOrderCache.length );
	// 			assert.equal( true, lint.sortOrder( indent + 'position', valid, app.config.sortOrder ) );
	// 			assert.equal( true, lint.sortOrder( indent + 'z-index', valid, app.config.sortOrder ) );
	// 			assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
	// 			assert.deepEqual( expectedCache, app.cache.sortOrderCache );
	// 		});

	// 		it('false if not correct sort order with mocked sort order cache', function() {
	// 			var expectedCache = [ 'border', 'margin', 'padding', 'line-height', 'background' ];

	// 			assert.equal( 'alphabetical', app.config.sortOrder );
	// 			assert.equal( 3, app.cache.sortOrderCache.length );
	// 			assert.equal( false, lint.sortOrder( indent + 'line-height', valid, app.config.sortOrder ) );
	// 			assert.equal( false, lint.sortOrder( indent + 'background', valid, app.config.sortOrder ) );
	// 			assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
	// 			assert.deepEqual( expectedCache, app.cache.sortOrderCache );
	// 		});
	// 	});

	// 	describe('grouped', function() {
	// 		beforeEach(function() {
	// 			app.config.sortOrder = 'grouped';
	// 			app.cache.sortOrderCache = [ 'position', 'right' ];
	// 		});

	// 		it('should return true if correct sort order with mocked sort order cache', function() {
	// 			var expectedCache = [ 'position', 'right', 'bottom', 'z-index', 'width' ];

	// 			assert.equal( 'grouped', app.config.sortOrder );
	// 			assert.equal( 2, app.cache.sortOrderCache.length );
	// 			assert.equal( true, lint.sortOrder( indent + 'bottom', valid, app.config.sortOrder ) );
	// 			assert.equal( true, lint.sortOrder( indent + 'z-index', valid, app.config.sortOrder ) );
	// 			assert.equal( true, lint.sortOrder( indent + 'width', valid, app.config.sortOrder ) );
	// 			assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
	// 			assert.deepEqual( expectedCache, app.cache.sortOrderCache );
	// 		});

	// 		it('false if not correct sort order with mocked sort order cache', function() {
	// 			var expectedCache = [ 'position', 'right', 'top' ];

	// 			assert.equal( 'grouped', app.config.sortOrder );
	// 			assert.equal( 2, app.cache.sortOrderCache.length );
	// 			assert.equal( false, lint.sortOrder( indent + 'top', valid, app.config.sortOrder ) );
	// 			assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
	// 			assert.deepEqual( expectedCache, app.cache.sortOrderCache );
	// 		});
	// 	});

	// 	describe('Array', function() {
	// 		beforeEach(function() {
	// 			app.config.sortOrder = [ 'z-index', 'animation', 'top' ];
	// 			app.cache.sortOrderCache = [ 'z-index' ];
	// 		});

	// 		it('should return true if correct sort order with mocked sort order cache', function() {
	// 			var expectedCache = [ 'z-index', 'animation', 'top', 'width', 'border' ];

	// 			assert.deepEqual( [ 'z-index', 'animation', 'top' ], app.config.sortOrder );
	// 			assert.equal( 1, app.cache.sortOrderCache.length );
	// 			assert.equal( true, lint.sortOrder( indent + 'animation', valid, app.config.sortOrder ) );
	// 			assert.equal( true, lint.sortOrder( indent + 'top', valid, app.config.sortOrder ) );
	// 			assert.equal( true, lint.sortOrder( indent + 'width', valid, app.config.sortOrder ) );
	// 			assert.equal( true, lint.sortOrder( indent + 'border', valid, app.config.sortOrder ) );
	// 			assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
	// 			assert.deepEqual( expectedCache, app.cache.sortOrderCache );
	// 		});

	// 		it('false if not correct sort order with mocked sort order cache', function() {
	// 			var expectedCache = [ 'z-index', 'top', 'animation' ];

	// 			assert.deepEqual( [ 'z-index', 'animation', 'top' ], app.config.sortOrder );
	// 			assert.equal( 1, app.cache.sortOrderCache.length );
	// 			assert.equal( true, lint.sortOrder( indent + 'top', valid, app.config.sortOrder ) );
	// 			assert.equal( false, lint.sortOrder( indent + 'animation', valid, app.config.sortOrder ) );
	// 			assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
	// 			assert.deepEqual( expectedCache, app.cache.sortOrderCache );
	// 		});
	// 	});
	// });

	// describe('trailing whitespace', function() {
	// 	it('should return false if no trailing whitespace', function() {
	// 		assert.equal( false, lint.whitespace('margin 0 auto') );
	// 	});

	// 	it('should return true if whitespace found', function() {
	// 		assert.equal( true, lint.whitespace('margin 0 auto	') );
	// 		assert.equal( true, lint.whitespace('margin 0 auto ') );
	// 	});

	// 	it('should return undefined if params missing', function() {
	// 		assert.equal( undefined, lint.whitespace() );
	// 	})
	// });

	// describe('universal selector', function() {
	// 	it('should return false if no invalid * is found', function() {
	// 		var test = 'return ( $width*$height )';
	// 		var test2 = 'content: "*"';

	// 		assert.equal( false, lint.universal('img'), ['img'] );
	// 		assert.equal( false, lint.universal( test, test.split(' ') ) );
	// 		assert.equal( false, lint.universal( test2, test2.split(' ') ) );
	// 	});

	// 	it('should return true if * is found', function() {
	// 		assert.equal( true, lint.universal( '*', ['*'] ) );
	// 		assert.equal( true, lint.universal( '*:before', ['*:before'] ) );
	// 		assert.equal( true, lint.universal( '*::after', ['*::after'] ) );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.universal() );
	// 	});
	// });

	// describe('valid property', function() {
	// 	it ('should return false if property not valid', function() {
	// 		assert.equal( false, lint.valid( 'marg 0 auto', valid ) );
	// 		assert.equal( false, lint.valid( 'pad 0', valid ) );
	// 		assert.equal( false, lint.valid( 'dog: irish-setter; }', valid ) );
	// 		assert.equal( false, lint.valid( '{var name}', valid ) );
	// 		assert.equal( false, lint.valid( 'div[attribute test]', valid ) );
	// 		assert.equal( false, lint.valid( '::selects', valid ) );
	// 	});

	// 	it ('should return true if property is valid', function() {
	// 		assert.equal( true, lint.valid( 'padding 0', valid ) );
	// 		assert.equal( true, lint.valid( '-webkit-border-radius 0', valid ) );
	// 		assert.equal( true, lint.valid( '.el:hover', valid ) );
	// 		assert.equal( true, lint.valid( 'input', valid ) );
	// 		assert.equal( true, lint.valid( 'body', valid ) );
	// 		assert.equal( true, lint.valid( '$var-name = ', valid ) );
	// 		assert.equal( true, lint.valid( '{var-name}', valid ) );
	// 		assert.equal( true, lint.valid( 'my-hash = {', valid ) );
	// 		assert.equal( true, lint.valid( 'for i in 0..9', valid ) );
	// 		assert.equal( true, lint.valid( '&--append-class-name', valid ) );
	// 		assert.equal( true, lint.valid( 'div[attribute]', valid ) );
	// 		assert.equal( true, lint.valid( '::selection', valid ) );
	// 		assert.equal( true, lint.valid( 'div:hover', valid ) );
	// 		assert.equal( true, lint.valid( '#id:hover', valid ) );
	// 		assert.equal( true, lint.valid( 'p:optional', valid ) );
	// 		assert.equal( true, lint.valid( '[data-js]', valid ) );
	// 	});

	// 	it ('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.valid( undefined, valid ) );
	// 		assert.equal( undefined, lint.valid( 'body', undefined ) );
	// 		assert.equal( undefined, lint.valid() );
	// 	});
	// });

	// /**
	//  * would like to have this be smarter
	//  * ideally it would know whether or not a $ should be used based on context
	//  * right now it just checks if $ is used when defining a var and thats it
	//  */
	// describe('var style check', function() {
	// 	it('should return false if $ is missing', function() {
	// 		assert.equal( false, lint.varStyle('myVar = 0') );
	// 	});

	// 	it('should return false if $ if block var', function() {
	// 		assert.equal( false, lint.varStyle('myVar = @block') );
	// 	});

	// 	it('should return true if $ is found (and correct', function() {
	// 		assert.equal( true, lint.varStyle('$myVar = 0') );
	// 		assert.equal( true, lint.varStyle('$first-value = floor( (100% / $columns) * $index )') );
	// 	});

	// 	it('should return undefined if line not testable', function() {
	// 		assert.equal( undefined, lint.varStyle('define-my-mixin( $myParam )') );
	// 		assert.equal( undefined, lint.varStyle('if($myParam == true)') );
	// 		assert.equal( undefined, lint.varStyle('.notAVar') );
	// 		assert.equal( undefined, lint.varStyle('if(myParam == true)') );
	// 		assert.equal( undefined, lint.varStyle('define-my-mixin( myParam )') );
	// 		assert.equal( undefined, lint.varStyle('  use-my-mixin( myParam )') );
	// 		assert.equal( undefined, lint.varStyle('  if( $myParam )') );
	// 	});

	// 	it('should return undefined if params missing', function() {
	// 		assert.equal( undefined, lint.varStyle() );
	// 	});
	// });

	// describe('zero units', function() {
	// 	it('should return false if 0 value is fine', function() {
	// 		assert.equal( false, lint.zeroUnits('margin 0') );
	// 		assert.equal( false, lint.zeroUnits('margin 50px') );
	// 	});

	// 	it('should return true if 0 + any unit type is found (0 is preferred)', function() {
	// 		assert.equal( true, lint.zeroUnits('margin 0px') );
	// 		assert.equal( true, lint.zeroUnits('margin 0em') );
	// 		assert.equal( true, lint.zeroUnits('margin 0rem') );
	// 		assert.equal( true, lint.zeroUnits('margin 0pt') );
	// 		assert.equal( true, lint.zeroUnits('margin 0pc') );
	// 		assert.equal( true, lint.zeroUnits('margin 0vh') );
	// 		assert.equal( true, lint.zeroUnits('margin 0vw') );
	// 		assert.equal( true, lint.zeroUnits('margin 0vmin') );
	// 		assert.equal( true, lint.zeroUnits('margin 0vmax') );
	// 		assert.equal( true, lint.zeroUnits('margin 0mm') );
	// 		assert.equal( true, lint.zeroUnits('margin 0cm') );
	// 		assert.equal( true, lint.zeroUnits('margin 0in') );
	// 		assert.equal( true, lint.zeroUnits('margin 0mozmm') );
	// 		assert.equal( true, lint.zeroUnits('margin 0ex') );
	// 		assert.equal( true, lint.zeroUnits('margin 0ch') );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.zeroUnits() );
	// 	});
	// });

	// describe('zIndex Duplicates', function() {
	// 	it('should return false if z-index is not found on line', function() {
	// 		assert.equal( false, lint.zIndexDupe('margin 0') );
	// 	});

	// 	it('should return false if z-index is unique', function() {
	// 		assert.equal( false, lint.zIndexDupe('z-index 0') );
	// 	});

	// 	it('should return true if z-index is duplicated', function() {
	// 		assert.equal( true, lint.zIndexDupe('z-index 0') );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.zIndexDupe() );
	// 	});

	// 	it('zCache at this point should be greater than 0', function() {
	// 		assert.equal( true, app.cache.zCache.length > 0 );
	// 	})
	// });

	// describe('zIndex Normalizer', function() {
	// 	it('should return false if z index value already normalized', function() {
	// 		app.config.zIndexNormalize = 5;
	// 		assert.equal( false, lint.zIndexNormalize('z-index 5') );
	// 	});

	// 	it('should return true if z index value needs to be normalized', function() {
	// 		assert.equal( true, lint.zIndexNormalize('z-index 4') );
	// 	});

	// 	it('should return undefined if z-index is not found on line', function() {
	// 		assert.equal( undefined, lint.zIndexNormalize('margin 0') );
	// 	});

	// 	it('should return undefined if missing params', function() {
	// 		assert.equal( undefined, lint.zIndexNormalize() );
	// 	});
	// });
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
// 		var success = app.emojiAllClear() + 'Stylint: You\'re all clear!';
// 		assert.equal( success, app.done( app ).msg );
// 	});

// 	it('msg should be the kill message', function() {
// 		// passing in kill should kill the linter no matter how many errs there are
// 		var kill = '\n0 Warnings\nStylint: too many errors, exiting';
// 		assert.equal( kill, app.done( app, 'kill' ).msg );
// 	});

// 	it('msg should be the too many errors message', function() {
// 		app.cache.warnings = [0,1,2,3,4,5,6,7,8,9,10];
// 		var tooMany = app.emojiWarning() + 'Stylint: ' + app.cache.warnings.length + ' warnings. Max is set to: ' + app.config.maxWarnings;
// 		assert.equal( tooMany, app.done( app ).msg );
// 	});

// 	it('msg should be the default errors message', function() {
// 		app.cache.warnings = [0,1,2,3,4,5];
// 		var initial = '\n' + app.emojiWarning() + app.cache.warnings.length + ' Warnings';
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
	// 	var test;

	// 	app.state.watching = false;
	// 	test = app.done( app );

	// 	app.done.getCall(0).returned( sinon.match.same( process.exit ) );
	// 	app.state.watching = true;
	// });
// });
