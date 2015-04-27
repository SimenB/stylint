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
app.state.quiet = true;
app.state.strictMode = true;
app.state.watching = true;

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

// describe('Core Methods: ', function() {

// 	describe('Done: ', function() {
// 		// it('should be a function', function() {
// 		// 	app.done.should.be.a('function');
// 		// });

// 		it('exit code should default to 1', function() {
// 			assert.equal( 1, app.state.exitCode );
// 		});

// 		it('exit code of 1 if errs', function() {
// 			app.cache.warnings = [0,1,2,3,4,5];
// 			assert.equal( 1, app.done( app ).exitCode );
// 		});
// 	});

// 	describe('Read: ', function() {
// 		sinon.spy( app, 'read' );

// 		app.state.path = 'styl/';
// 		const dirTest = app.read();
// 		app.state.path = 'styl/test2.styl';
// 		const fileTest = app.read();
// 		app.state.path = process.cwd();
// 		const cwdTest = app.read();

// 		it('should be a function', function() {
// 			app.read.should.be.a('function');
// 		});

// 		it('return parse function if passed a dir', function() {
// 			app.read.getCall(0).returned( sinon.match.same( app.parse ) );
// 		});

// 		it('return parse function if passed a filename', function() {
// 			app.read.getCall(1).returned( sinon.match.same( app.parse ) );
// 		});

// 		it('return parse function if nothing passed', function() {
// 			app.read.getCall(2).returned( sinon.match.same( app.parse ) );
// 		});
// 	});

// 	describe('Parse: ', function() {
// 		sinon.spy( app, 'parse' );
// 		app.state.path = 'styl/test2.styl';
// 		const lintTest = app.parse();
// 		app.cache.fileNo = app.cache.filesLen;
// 		const doneTest = app.parse();
// 		app.state.path = 'styl/oneLine.styl';
// 		const oneLineTest = app.parse();

// 		it('should be a function', function() {
// 			app.parse.should.be.a( 'function' );
// 		});

// 		it('lint function returned if passed a filename', function() {
// 			app.parse.getCall(0).returned( sinon.match.same( app.lint ) );
// 		});

// 		it('returns app.done when done parsing last file', function() {
// 			app.parse.getCall(1).returned( sinon.match.same( app.done ) );
// 		});

// 		it('should handle empty or one line files fine', function() {
// 			app.parse.getCall(2).returned( sinon.match.same( app.lint ) );
// 		});
// 	});

// 	describe('Lint: ', function() {
// 		sinon.spy( app, 'lint' );
// 		const test = app.lint( app, '  margin 0 auto ', 5, 'margin 0 auto', 'styl/test2.styl' );

// 		it('should be a function', function() {
// 			app.lint.should.be.a( 'function' );
// 		});

// 		it('first param should be the app object', function() {
// 			assert.deepEqual( app.lint.getCall(0).args[0], app );
// 		});

// 		it('second param should be a string', function() {
// 			app.lint.getCall(0).args[1].should.be.a( 'string' );
// 		});

// 		it('third param should be a number', function() {
// 			app.lint.getCall(0).args[2].should.be.a( 'number' );
// 		});

// 		it('fourth param should be a string', function() {
// 			app.lint.getCall(0).args[3].should.be.a( 'string' );
// 		});

// 		it('fifth param should be a string', function() {
// 			app.lint.getCall(0).args[4].should.be.a( 'string' );
// 		});
// 	});

// 	describe('Watch: ', function() {
// 		sinon.spy( app, 'watch' );
// 		// call it so we can use spy
// 		app.watch( app );

// 		it('should be a function', function() {
// 			app.watch.should.be.a( 'function' );
// 		});

// 		it('first param should be the app object', function() {
// 			assert.deepEqual( app, app.watch.getCall(0).args[0] );
// 		});
// 	});

// 	describe('Help: ', function() {
// 		sinon.spy( app, 'help' );
// 		const test = app.help( app );

// 		it('should be a function', function() {
// 			app.help.should.be.a( 'function' );
// 		});

// 		it('undefined', function() {
// 			assert.equal( undefined, app.help.getCall(0).returnValue );
// 		});
// 	});

// 	describe('Version: ', function() {
// 		sinon.spy( app, 'ver' );
// 		const test = app.ver( app, __dirname );

// 		it('should be a function', function() {
// 			app.ver.should.be.a( 'function' );
// 		});

// 		it('a console log function', function() {
// 			app.ver.getCall(0).returned( sinon.match.same( console.log ) );
// 		});
// 	});

// 	describe('Set Config Method:', function() {
// 		const testMethod = app.setConfig( '.stylintrc' );
// 		const testConfig = JSON.parse( fs.readFileSync( process.cwd() + '/.stylintrc' ) );

// 		it('should update config state if passed a valid path', function() {
// 			assert.deepEqual( testMethod, testConfig );
// 		});

// 		it('undefined if passed invalid path', function() {
// 			should.Throw(function() {
// 				app.setConfig( '.nonsenserc' );
// 			}, Error);
// 		});
// 	});

// 	describe('Get Files: ', function() {
// 		sinon.spy( app, 'getFiles' );
// 		const test = app.getFiles( '/styl' );

// 		it('app.parseFile if passed directory', function() {
// 			app.getFiles.getCall(0).returned( sinon.match.same( app.parseFile ) );
// 		});

// 		it('undefined if passed filename', function() {
// 			assert.equal( undefined, app.getFiles( '/styl/test2.styl' ) );
// 		});

// 		it('should throw if path is not a string', function() {
// 			should.Throw(function() {
// 				app.getFiles( 5 );
// 			}, TypeError);
// 		});

// 		it('should throw if passed nothing', function() {
// 			should.Throw(function() {
// 				app.getFiles();
// 			}, Error);
// 		});
// 	});

// 	describe('Emoji: ', function() {
// 		it('all clear if on windows and option turned on should output smiley', function() {
// 			assert.equal( ':)', app.emojiAllClear( true, 'windows' ) );
// 		});

// 		it('warning if on windows and option turned on should output frowney', function() {
// 			assert.equal( ':(', app.emojiWarning( true, 'windows' ) );
// 		});

// 		it('all clear if on unix and option turned on should output emoji', function() {
// 			assert.equal( '\uD83D\uDC4D  ', app.emojiAllClear( true ) );
// 		});

// 		it('warning if on unix and option turned on should output emoji', function() {
// 			assert.equal( '\uD83D\uDCA9  ', app.emojiWarning( true ) );
// 		});

// 		it('both should output a blank string if option is off', function() {
// 			assert.equal( '', app.emojiAllClear( false ) );
// 			assert.equal( '', app.emojiWarning( false ) );
// 		});
// 	});

// 	describe('Reset (after change)', function() {
// 		const resetTest = app.resetOnChange.bind(app);

// 		beforeEach(function() {
// 			app.state.watching = false;
// 		});

// 		it('reset on change should change dir to curr file', function() {
// 			resetTest('../styl/_ads.styl');
// 			assert.equal( true, app.state.path === '../styl/_ads.styl');
// 		});

// 		it('reset should reset all caches', function() {
// 			resetTest('../styl/_ads.styl');
// 			assert.equal( true,
// 				app.cache.alphaCache.length === 0 &&
// 				app.cache.rootCache.length === 0 &&
// 				app.cache.selectorCache.length === 0 &&
// 				app.cache.warnings.length === 0 &&
// 				app.cache.zCache.length === 0
// 			);
// 		});

// 		it('reset should set prevLine and prevFile to empty strings', function() {
// 			resetTest('../styl/_ads.styl');
// 			assert.equal( true,
// 				app.cache.prevLine === '' &&
// 				app.cache.prevFile === ''
// 			);
// 		});

// 		it('reset should set prevContext to 0', function() {
// 			resetTest('../styl/_ads.styl');
// 			assert.equal( true, app.cache.prevContext === 0 );
// 		});
// 	});
// });

describe('Linter Style Checks: ', function() {
	const lint = app.lintMethods;
	const state = app.stateMethods;

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

		it('false if bracket found, but not illegal: in hash', function() {
			app.state.hash = true;
			assert.equal( false, bracketsTest('}') );
			assert.equal( false, bracketsTest('{interpolation}') );
			assert.equal( false, bracketsTest('.class-name-with-{i}') );
		});

		it('false if bracket found but not illegal: not in a hash', function() {
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

	describe('comment exists', function() {
		const existsTest = state.commentExists.bind(app);

		it ('false if // not present at all on line', function() {
			assert.equal( false, existsTest('.noCommentOnThisLine ') );
		});

		it ('true if // is present anywhere on the line', function() {
			assert.equal( true, existsTest('//test') );
			assert.equal( true, existsTest('margin 0 auto //test') );
			assert.equal( true, existsTest('margin 0 auto // test') );
			assert.equal( true, existsTest('// test') );
		});
	});

	describe('starts with comment', function() {
		const startsWithComment = state.startsWithComment.bind(app);

		it('false if // not first char on line', function() {
			assert.equal( false, startsWithComment('margin 0 auto //test') );
		});

		it('true if // is the first character on the line', function() {
			assert.equal( true, startsWithComment('//test') );
			assert.equal( true, startsWithComment(' // test') );
		});
	});

	describe('colon: prefer margin 0 over margin: 0', function() {
		const colonTest = lint.colons.bind(app);

		it('false if no unecessary colons found', function() {
			assert.equal( false, colonTest('margin 0 auto') );
			app.state.hash = true;
			assert.equal( false, colonTest('key: value') );
		});

		it('true if unecessary colon is found', function() {
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

		it('false if space after comma, or no comma', function() {
			assert.equal( false, commaTest('0, 0, 0, .18') );
			assert.equal( false, commaTest('margin 0') );
		});

		it('false if newline after comma', function() {
			assert.equal( false, commaTest('.className,\n') );
		});

		it('true if no space after commas', function() {
			assert.equal( true, commaTest('0,0, 0, .18') );
		});
	});


	describe('comment space: prefer "// Comment" over "//Comment"', function() {
		const commentSpaceTest = lint.commentSpace.bind(app);

		it('false if line comment doesnt have a space after it', function() {
			assert.equal( false, commentSpaceTest('//test') );
			assert.equal( false, commentSpaceTest('margin 0 auto //test') );
		});

		it('true if line comment has space after it', function() {
			assert.equal( true, commentSpaceTest('// test') );
			assert.equal( true, commentSpaceTest('margin 0 auto // test') );
		});

		it('undefined if line has no comment', function() {
			app.state.hasComment = false;
			assert.equal( undefined, commentSpaceTest('.test') );
		});
	});

	describe('css literal', function() {
		const cssTest = lint.cssLiteral.bind(app);

		it('false if @css is not used', function() {
			app.state.cssLiteral = false;
			assert.equal( false, cssTest('margin 0') );
			assert.equal( false, cssTest('@extends $placeholderconst') );
			assert.equal( false, cssTest('@require "lint.styl"') );
		});

		it('true if @css is used ', function() {
			assert.equal( true, cssTest('@css {') );
		});

		it('undefined if already in css literal', function() {
			app.state.cssBlock = true;
			assert.equal( undefined, cssTest('.test') );
		});
	});

	describe('depthLimit', function() {
		const nestTest = lint.depthLimit.bind(app);

		it('false if less indents than depth limit', function() {
			app.config.depthLimit = 4;
			app.config.indentPref = 4;
			app.setContext('margin 0');
			assert.equal( false, nestTest('margin 0') );
			app.setContext('			margin 0');
			assert.equal( false, nestTest('			margin 0') );
			app.config.indentPref = 'tabs';
			app.setContext('&:hover');
			assert.equal( false, nestTest('&:hover') );
			app.setContext('.class-name');
			assert.equal( false, nestTest('.class-name') );
		});

		it('true if more indents than depth limit', function() {
			app.config.depthLimit = 2;
			app.config.indentPref = 2;
			app.setContext('       margin 0');
			assert.equal( true, nestTest('       margin 0') );
			app.config.indentPref = 4;
			app.setContext('          margin 0');
			assert.equal( true, nestTest('          margin 0') );
			app.config.depthLimit = 4;
			app.setContext('                   margin 0');
			assert.equal( true, nestTest('                   margin 0') );
			app.config.indentPref = 'tabs';
			app.setContext('					margin 0');
			assert.equal( true, nestTest('					margin 0') );
			app.config.depthLimit = 1;
			app.setContext('		margin 0 )');
			assert.equal( true, nestTest('		margin 0 )') );
		});
	});

	describe('duplicates', function() {
		const dupeTest = lint.duplicates.bind(app);

		it('tabs: false if no dupe, not root, diff context, same selector', function() {
			app.config.indentPref = 'tabs';
			app.cache.file = 'file.styl';
			app.cache.prevFile = 'file.styl'
			app.setContext('	.test'); // 1
			dupeTest('	.test');
			app.setContext('			.test'); // 3
			assert.equal( false, dupeTest('			.test') );
		});

		it('tabs: false if globalDupe off, diff files, same context, same selector', function() {
			app.config.globalDupe = true;
			app.cache.prevFile = 'file5.styl';
			app.cache.file = 'file6.styl';
			app.setContext('	.test'); // 1
			app.setContext('	.test'); // 1
			assert.equal( false, dupeTest('	.test') );
			app.config.globalDupe = false;
		});

		it('tabs: false if prev selector was in a list, same file, same context, same selector', function() {
			app.cache.prevFile = 'file.styl';
			app.cache.file = 'file.styl';
			app.setContext('	.classy,'); // to set the context
			dupeTest('	.classy,'); // prev selecto
			assert.equal( false, dupeTest('	.classy') );
		});

		it('tabs: false if selector is in a list', function() {
			assert.equal( false, dupeTest('	.classy,') );
		});

		it('tabs: false if global dupe off and file changed', function() {
			dupeTest('	.test4'); // to set the context
			app.cache.prevFile = 'file.styl';
			app.cache.file = 'file2.styl';
			app.config.globalDupe = false;
			assert.equal( false, dupeTest('	.test4') );
		});

		it('spaces: false if no dupe, not root, diff context, same selector', function() {
			app.config.indentPref = 4;
			app.cache.file = 'file.styl';
			app.cache.prevFile = 'file.styl'
			app.setContext('    .test'); // 1
			dupeTest('    .test');
			app.setContext('            .test'); // 3
			assert.equal( false, dupeTest('            .test') );
		});

		it('spaces: false if globalDupe off, diff files, same context, same selector', function() {
			app.config.globalDupe = true;
			app.cache.prevFile = 'file5.styl';
			app.cache.file = 'file6.styl';
			app.setContext('    .test'); // 1
			app.setContext('    .test'); // 1
			assert.equal( false, dupeTest('    .test') );
			app.config.globalDupe = false;
		});

		it('spaces: false if prev selector was in a list, same file, same context, same selector', function() {
			app.cache.prevFile = 'file.styl';
			app.cache.file = 'file.styl';
			app.setContext('    .classy,'); // to set the context
			dupeTest('    .classy,'); // prev selector
			assert.equal( false, dupeTest('    .classy') );
		});

		it('spaces: false if selector is in a list', function() {
			assert.equal( false, dupeTest('    .classy,') );
		});

		it('space: false if global dupe off and file changed', function() {
			dupeTest('    .test4'); // to set the context
			app.cache.prevFile = 'file.styl';
			app.cache.file = 'file2.styl';
			app.config.globalDupe = false;
			assert.equal( false, dupeTest('    .test4') );
		});

		it('false if root selector dupe was in list', function() {
			app.state.context = 0;
			app.state.prevContext = 0;
			app.config.globalDupe = false;
			app.cache.file = 'file.styl';
			dupeTest('.test,'); // to set the context
			assert.equal( false, dupeTest('.test') );
		});

		it('tabs: true if nested selector is dupe', function() {
			app.cache.prevFile = 'file.styl';
			app.cache.file = 'file.styl';
			app.state.context = 1;
			app.state.prevContext = 1;
			dupeTest('	.test');
			assert.equal( true, dupeTest('	.test') );
		});

		it('spaces: true if nested selector is dupe', function() {
			app.cache.prevFile = 'file.styl';
			app.cache.file = 'file.styl';
			app.state.context = 1;
			app.state.prevContext = 1;
			dupeTest('    .test2');
			assert.equal( true, dupeTest('    .test2') );
		});

		it('true if root selector is dupe, same file', function() {
			app.state.context = 0;
			app.state.prevContext = 0;
			dupeTest('.test3'); // to set the context
			assert.equal( true, dupeTest('.test3') );
		});

		it('true if root selector is dupe, global dupe test', function() {
			app.state.context = 0;
			app.state.prevContext = 0;
			app.config.globalDupe = true;
			app.cache.prevFile = 'file.styl';
			dupeTest('.test'); // to set the context
			app.cache.file = 'file2.styl';
			assert.equal( true, dupeTest('.test') );
			app.config.globalDupe = false;
		});
	});

	describe('efficient: prefer margin 0 over margin 0 0 0 0', function() {
		const efficientTest = lint.efficient.bind(app);

		it('false if value is not efficient', function() {
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

		it('true if value is efficient', function() {
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

		it('undefined if nothing to test', function() {
			app.cache.line = 'border 0';
			assert.equal( undefined, efficientTest() );
		});
	});

	describe('extends style: prefer @extends over @extend (or vice versa)', function() {
		const extendTest = lint.extendPref.bind(app);

		it('false if value doesnt match preferred style', function() {
			app.config.extendsPref = '@extends';
			assert.equal( false, extendTest('@extend $placeHolderconst') );
			app.config.extendsPref = '@extend';
			assert.equal( false, extendTest('@extends $placeHolderconst') );
		});

		it('true if value matches preferred style', function() {
			app.config.extendsPref = '@extend';
			assert.equal( true, extendTest('@extend $placeHolderconst') );
			app.config.extendsPref = '@extends';
			assert.equal( true, extendTest('@extends $placeHolderconst') );
		});

		it('undefined if no extend on line', function() {
			assert.equal( undefined, extendTest('$const = #fff') );
		});
	});

	describe('hash start', function() {
		const hashTest = state.hashStart.bind(app);

		it('false if hash start not found', function() {
			assert.equal( false, hashTest('$myconst =') );
			assert.equal( false, hashTest('myconst = @block') );
			assert.equal( false, hashTest('.mistakenUseOfBracket {') );
			assert.equal( false, hashTest('margin 0') );
		});

		it('true if = and { are found on the same line (hash start)', function() {
			assert.equal( true, hashTest('myHash = {') );
		});

		it('app.state.hash should be true after hash start', function() {
			assert.equal( true, app.state.hash );
		});

		it('undefined if in a hash', function() {
			assert.equal( undefined, hashTest('myHash = {') );
		});
	});

	describe('hash end', function() {
		const hashTest = state.hashEnd.bind(app);

		it('false if in hash and valid } found', function() {
			app.state.hash = true;
			assert.equal( false, hashTest('}') );
		});

		it('true if hash end } not found', function() {
			app.state.hash = true;
			assert.equal( true, hashTest('margin 0') );
			assert.equal( true, hashTest('myHash = {') );
		});

		it('after finding end of hash, hash state should equal false', function() {
			app.state.hash = true;
			assert.equal( false, hashTest('}') );
			assert.equal( false, app.state.hash );
		});

		it('undefined if not in a hash', function() {
			app.state.hash = false;
			assert.equal( undefined, hashTest('margin 0') );
			assert.equal( undefined, hashTest('myHash = {') );
			assert.equal( undefined, hashTest('}') );
		});
	});

	describe('keyframes end', function() {
		const keyframesEndTest = state.keyframesEnd.bind(app);

		it('false if keyframes active and context set to 0 (keyframes ended)', function() {
			app.state.keyframes = true;
			app.state.context = 0;
			assert.equal( false, keyframesEndTest('.newClass') );
		});

		it('true if line doesnt have a context of zero', function() {
			app.state.keyframes = true;
			app.state.context = 1;
			assert.equal( true, keyframesEndTest('		from {') );
		});

		it('undefined if NOT already in @keyframes', function() {
			app.state.keyframes = false;
			assert.equal( undefined, keyframesEndTest('margin 0') );
		});
	});

	describe('keyframes start', function() {
		const keyframesStartTest = state.keyframesStart.bind(app);

		it('true if line has @keyframes', function() {
			app.state.keyframes = false;
			assert.equal( true, keyframesStartTest('@keyframes {') );
		});

		it('false if line isnt a start of @keyframes', function() {
			app.state.keyframes = false;
			assert.equal( false, keyframesStartTest('margin 0') );
		});

		it('undefined if already in @keyframes', function() {
			app.state.keyframes = true;
			assert.equal( undefined, keyframesStartTest('margin 0') );
		});
	});

	describe('leading zero', function() {
		const zeroTest = lint.leadingZero.bind(app);

		it('true if line has a zero before a decimal point and not part of range', function() {
			assert.equal( true, zeroTest('color (0, 0, 0, 0.18)') );
			assert.equal( true, zeroTest('color (0,0,0,0.18)') );
		});

		it('false if leading zero not found', function() {
			assert.equal( false, zeroTest('color (0, 0, 0, .18)') );
			assert.equal( false, zeroTest('color (0,0,0,.18)') );
			assert.equal( false, zeroTest('for $ in (0..9)') );
		});
	});

	describe('mixed spaces and tabs', function() {
		const mixed = lint.mixed.bind(app);

		it('false if no mixed spaces and tabs found: spaces preferred', function() {
			app.config.indentSpaces = 4;
			assert.equal( false, mixed('    margin 0') );
		});

		it('false if no mixed spaces and tabs found: tabs preferred', function() {
			app.config.indentSpaces = false;
			assert.equal( false, mixed('	margin 0') );
		});

		it('true if spaces and tabs are mixed: spaces preferred', function() {
			app.config.indentSpaces = 4;
			assert.equal( true, mixed('	  margin 0') );
			assert.equal( true, mixed('	padding 0em') );
		});

		it('true if spaces and tabs are mixed: tabs preferred', function() {
			app.config.indentSpaces = false;
			assert.equal( true, mixed('	    margin 0') );
		});
	});

	describe('naming convention', function() {
		const conventionTest = lint.namingConvention.bind(app);

		beforeEach(function() {
			app.config.namingConventionStrict = true;
		});

		afterEach(function() {
			app.config.namingConventionStrict = false;
		})

		it('false if correct naming convention: lowercase-dash', function() {
			app.config.namingConvention = 'lowercase-dash';

			assert.equal( false, conventionTest('$var-name-like-this =') );
			assert.equal( false, conventionTest('.class-name-like-this') );
			assert.equal( false, conventionTest('#id-name-like-this') );
			assert.equal( false, conventionTest('.block-{$class-name}') );
			assert.equal( false, conventionTest('#{$class-name}') );
			assert.equal( false, conventionTest('#block-{$class-name}') );
			assert.equal( false, conventionTest(':{$const-name}') );
			assert.equal( false, conventionTest('$constname') );
			assert.equal( false, conventionTest('$constname = "Font Name"') );
		});

		it('false if correct naming convention: lowercase_underscore', function() {
			app.config.namingConvention = 'lowercase_underscore';

			assert.equal( false, conventionTest('$const_name_like_this =') );
			assert.equal( false, conventionTest('.class_name_like_this') );
			assert.equal( false, conventionTest('#id_name_like_this') );
			assert.equal( false, conventionTest('.block_{$const_name}') );
			assert.equal( false, conventionTest('#{$const_name}') );
			assert.equal( false, conventionTest('#block_{$const_name}') );
			assert.equal( false, conventionTest(':{$const_name}') );
			assert.equal( false, conventionTest('$constname') );
			assert.equal( false, conventionTest('$constname = "Font Name"') );
		});

		it('false if correct naming convention: camelCase', function() {
			app.config.namingConvention = 'camelCase';

			assert.equal( false, conventionTest('$varNameLikeThis =') );
			assert.equal( false, conventionTest('.classNameLikeThis') );
			assert.equal( false, conventionTest('#idNameLikeThis') );
			assert.equal( false, conventionTest('.block{$varName}') );
			assert.equal( false, conventionTest('#{$varName}') );
			assert.equal( false, conventionTest('#block{$varName}') );
			assert.equal( false, conventionTest(':{$varName}') );
			assert.equal( false, conventionTest('$varname') );
			assert.equal( false, conventionTest('$varname = "Font-name"') );
		});

		it('false if correct naming convention: BEM', function() {
			app.config.namingConvention = 'BEM';

			assert.equal( false, conventionTest('$var-name__like-this =') );
			assert.equal( false, conventionTest('.class-name__like-this') );
			assert.equal( false, conventionTest('#id-name__like-this') );
			assert.equal( false, conventionTest('.block-{$var__name}') );
			assert.equal( false, conventionTest('#{$var__name}') );
			assert.equal( false, conventionTest(':{$var__name}') );
			assert.equal( false, conventionTest('#block__{$var-name}') );
			assert.equal( false, conventionTest('#block{$var-name}') );
			assert.equal( false, conventionTest('$varname') );
			assert.equal( false, conventionTest('$varname = "Font Name"') );
		});

		it('true if NOT correct naming convention: lowercase-dash', function() {
			app.config.namingConvention = 'lowercase-dash';

			assert.equal( true, conventionTest('$var_name_like_this =') );
			assert.equal( true, conventionTest('.class_name_like_this') );
			assert.equal( true, conventionTest('#id_name_like_this') );
			assert.equal( true, conventionTest('.block_{$var-name}') );
			assert.equal( true, conventionTest('#{$var_name}') );
			assert.equal( true, conventionTest('#block_{$var_name}') );
			assert.equal( true, conventionTest(':{$var_name}') );
			assert.equal( true, conventionTest('.block_{$var-name}') );
		});

		it('true if NOT correct naming convention: lowercase_underscore', function() {
			app.config.namingConvention = 'lowercase_underscore';

			assert.equal( true, conventionTest('$const-name-like-this =') );
			assert.equal( true, conventionTest('.class-name-like-this') );
			assert.equal( true, conventionTest('#id-name-like-this') );
			assert.equal( true, conventionTest('.block-{$const-name}') );
			assert.equal( true, conventionTest('#{$const-name}') );
			assert.equal( true, conventionTest('#block-{$const-name}') );
			assert.equal( true, conventionTest(':{$const-name}') );
			assert.equal( true, conventionTest('.block-{$constName}') );
			assert.equal( true, conventionTest('#{$constName}') );
			assert.equal( true, conventionTest('#block-{$constName}') );
			assert.equal( true, conventionTest(':{$constName}') );
			assert.equal( true, conventionTest('.block_{$const-name}') );
		});

		it('true if NOT correct naming convention: camelCase', function() {
			app.config.namingConvention = 'camelCase';

			assert.equal( true, conventionTest('$const-name-like-this =') );
			assert.equal( true, conventionTest('.class-name-like-this') );
			assert.equal( true, conventionTest('#id-name-like-this') );
			assert.equal( true, conventionTest('$const_name_like_this =') );
			assert.equal( true, conventionTest('.class_name_like_this') );
			assert.equal( true, conventionTest('#id_name_like_this') );
			assert.equal( true, conventionTest('.block{$const-name}') );
			assert.equal( true, conventionTest('#{$const-name}') );
			assert.equal( true, conventionTest('#block{$const-name}') );
			assert.equal( true, conventionTest(':{$const-name}') );
			assert.equal( true, conventionTest('.block{$const_name}') );
			assert.equal( true, conventionTest('.block{$const-name}') );
			assert.equal( true, conventionTest('#{$const_name}') );
			assert.equal( true, conventionTest(':{$const_name}') );
			assert.equal( true, conventionTest('.block_{$const-name}') );
		});

		it('true if not correct naming convention: BEM', function() {
			app.config.namingConvention = 'BEM';

			assert.equal( true, conventionTest('.classNameLikeThis') );
			assert.equal( true, conventionTest('#id_name_like_this') );
			assert.equal( true, conventionTest('.block_{$constName}') );
			assert.equal( true, conventionTest('#{$constName}') );
			assert.equal( true, conventionTest('#block_{$const-name}') );
			assert.equal( true, conventionTest('.block_{$const-name}') );
		});
	});

	describe('naming convention: strict turned off: ', function() {
		const conventionTest = lint.namingConvention.bind(app);

		beforeEach(function() {
			app.config.namingConventionStrict = false;
		});

		it('false if using classes or ids', function() {
			assert.equal( false, conventionTest('.class_name_like_this') );
			assert.equal( false, conventionTest('#id_name_like_this') );
			assert.equal( false, conventionTest('.class-name-like-this') );
			assert.equal( false, conventionTest('#id-name-like-this') );
			assert.equal( false, conventionTest('.class-name-like-this') );
			assert.equal( false, conventionTest('#id-name-like-this') );
		});

		it('false if passed made up or incorrect convention', function() {
			app.config.namingConvention = 'somethin';
			assert.equal( false, conventionTest('$var_name_like_this') );
		});
	});

	describe('noNone: prefer 0 over none', function() {
		const noneTest = lint.noNone.bind(app);

		it('false if border none not present', function() {
			app.cache.line = 'border 0';
			assert.equal( false, noneTest() );
			app.cache.line = 'border: 0';
			assert.equal( false, noneTest() );
			app.cache.line = 'border:0';
			assert.equal( false, noneTest() );
		});

		it('false if no outline none found', function() {
			app.cache.line = 'outline 0';
			assert.equal( false, noneTest() );
			app.cache.line = 'outline: 0';
			assert.equal( false, noneTest() );
			app.cache.line = 'outline:0';
			assert.equal( false, noneTest() );
		});

		it('true if border none is present', function() {
			app.cache.line = 'border none';
			assert.equal( true, noneTest() );
			app.cache.line = 'border: none';
			assert.equal( true, noneTest() );
			app.cache.line = 'border:none';
			assert.equal( true, noneTest() );
		});

		it('true if outline none found', function() {
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

		it('false if no parens spacing found', function() {
			assert.equal( false, parenTest('myMixin(param1, param2)') );
		});

		it('false if no parens on line', function() {
			assert.equal( true, parenTest('.notAMixin ') );
		});

		it('true if correct parens spacing found', function() {
			assert.equal( true, parenTest('myMixin( param1, param2 )') );
		});
	});

	describe('placeholder style', function() {
		const placeholderTest = lint.placeholders.bind(app);

		it('false if placeholder const not used', function() {
			assert.equal( false, placeholderTest('@extend .notPlaceholderconst') );
			assert.equal( false, placeholderTest('@extends .notPlaceholderconst') );
		});

		it('false if @extend by itself', function() {
			assert.equal( false, placeholderTest('@extend$placeholderconst') );
			assert.equal( false, placeholderTest('@extends') );
		});

		it('true if no extend found', function() {
			assert.equal( true, placeholderTest('margin 0') );
		});

		it('true if placeholder const is used', function() {
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

		it('false if no semicolon is found', function() {
			assert.equal( false, semiTest('margin 0 auto') );
		});

		it('true if semicolon found', function() {
			assert.equal( true, semiTest('margin 0 auto;') );
		});
	});

	describe('stacked properties', function() {
		const stackedTest = lint.stackedProperties.bind(app);

		it('false if not a one liner', function() {
			assert.equal( false, stackedTest('margin 0 auto') );
		});

		it('true if one liner', function() {
			assert.equal( true, stackedTest('margin 0 auto; padding: 5px;') );
			assert.equal( true, stackedTest('margin 0 auto; padding: 5px;') );
		});
	});

	describe('sort order', function() {
		const sortTest = lint.sortOrder.bind(app);
		const indent = ' ';

		beforeEach(function() {
			app.state.prevContext = 1;
			app.state.context = 1;
		});

		afterEach(function() {
			app.cache.sortOrderCache = [];
		});

		it('undefined if root level', function() {
			app.state.context = 0;
			assert.equal( undefined, sortTest('margin 0'));
		});

		it('cache length should only be 1 (the current prop) if context switched', function() {
			app.cache.sortOrderCache = [ 'border', 'margin', 'padding' ];
			app.state.prevContext = 0;
			app.state.context = 1;

			assert.equal( 3, app.cache.sortOrderCache.length );
			sortTest('margin 0');
			assert.equal( 1, app.cache.sortOrderCache.length );
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

			afterEach(function() {
				app.cache.sortOrderCache = [];
			});

			it('true if correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'border', 'margin', 'padding', 'position', 'z-index' ];

				assert.equal( 'alphabetical', app.config.sortOrder );
				assert.equal( 3, app.cache.sortOrderCache.length );
				assert.equal( true, sortTest('	position absolute') );
				assert.equal( true, sortTest('	z-index 1') );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});

			it('false if not correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'border', 'margin', 'padding', 'line-height', 'background' ];

				assert.equal( 'alphabetical', app.config.sortOrder );
				assert.equal( 3, app.cache.sortOrderCache.length );
				assert.equal( false, sortTest('	line-height 1') );
				assert.equal( false, sortTest('	background none') );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});
		});

		describe('grouped', function() {
			beforeEach(function() {
				app.config.sortOrder = 'grouped';
				app.cache.sortOrderCache = [ 'position', 'right' ];
			});

			afterEach(function() {
				app.cache.sortOrderCache = [];
			});

			it('false if sorted array is shorter than cache', function() {
				app.cache.sortOrderCache = [ 'border', 'margin', 'padding' ];
				assert.equal( false, sortTest('margin 0'));
			});

			it('false if not correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'position', 'right', 'top' ];

				assert.equal( 'grouped', app.config.sortOrder );
				assert.equal( 2, app.cache.sortOrderCache.length );
				assert.equal( false, sortTest('top 0') );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});

			it('true if correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'position', 'right', 'bottom', 'z-index', 'width' ];

				assert.equal( 'grouped', app.config.sortOrder );
				assert.equal( 2, app.cache.sortOrderCache.length );
				assert.equal( true, sortTest('bottom 0') );
				assert.equal( true, sortTest('z-index 1') );
				assert.equal( true, sortTest('width 50%') );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});
		});

		describe('Array', function() {
			beforeEach(function() {
				app.config.sortOrder = [ 'z-index', 'animation', 'top' ];
				app.cache.sortOrderCache = [ 'z-index' ];
			});

			afterEach(function() {
				app.cache.sortOrderCache = [];
			});

			it('false if not correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'z-index', 'top', 'animation' ];

				assert.deepEqual( [ 'z-index', 'animation', 'top' ], app.config.sortOrder );
				assert.equal( 1, app.cache.sortOrderCache.length );
				assert.equal( true, sortTest('top 50px') );
				assert.equal( false, sortTest('animation fade-out') );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});

			it('true if correct sort order with mocked sort order cache', function() {
				const expectedCache = [ 'z-index', 'animation', 'top', 'width', 'border' ];

				assert.deepEqual( [ 'z-index', 'animation', 'top' ], app.config.sortOrder );
				assert.equal( 1, app.cache.sortOrderCache.length );
				assert.equal( true, sortTest('animation fade-in') );
				assert.equal( true, sortTest('top 0') );
				assert.equal( true, sortTest('width 50%') );
				assert.equal( true, sortTest('border 0') );
				assert.equal( expectedCache.length, app.cache.sortOrderCache.length );
				assert.deepEqual( expectedCache, app.cache.sortOrderCache );
			});
		});
	});

	describe('stylint off toggle:', function() {
		const toggleTest = state.stylintOff.bind(app);

		it('false if tests enabled and toggle found', function() {
			app.state.testsEnabled = true;
			assert.equal( false, toggleTest('@stylint off') );
		});

		it('true if tests enabled and toggle not found', function() {
			app.state.testsEnabled = true;
			assert.equal( true, toggleTest('margin 0 auto') );
		});

		it('undefined if tests already disabled', function() {
			app.state.testsEnabled = false;
			assert.equal( undefined, toggleTest('@stylint on') );
		});
	});

	describe('stylint on toggle:', function() {
		const toggleTest = state.stylintOn.bind(app);

		it('false if tests disabled and toggle not found', function() {
			app.state.testsEnabled = false;
			assert.equal( false, toggleTest('margin 0 auto') );
		});

		it('true if tests disabled and toggle found', function() {
			app.state.testsEnabled = false;
			assert.equal( true, toggleTest('@stylint on') );
		});

		it('undefined if tests already enabled', function() {
			app.state.testsEnabled = true;
			assert.equal( undefined, toggleTest('@stylint on') );
		});
	});

	describe('trailing whitespace', function() {
		const whitespaceTest = lint.trailingWhitespace.bind(app);

		it('false if no trailing whitespace', function() {
			assert.equal( false, whitespaceTest('margin 0 auto') );
		});

		it('true if whitespace found', function() {
			assert.equal( true, whitespaceTest('margin 0 auto	') );
			assert.equal( true, whitespaceTest('margin 0 auto ') );
		});
	});

	describe('universal selector', function() {
		const universalTest = lint.universal.bind(app);

		it('false if no invalid * is found', function() {
			assert.equal( false, universalTest('img') );
			assert.equal( false, universalTest('return ( $width*$height )') );
			assert.equal( false, universalTest('content: "*"') );
		});

		it('true if * is found', function() {
			assert.equal( true, universalTest('*') );
			assert.equal( true, universalTest('*:before') );
			assert.equal( true, universalTest('*::after') );
		});
	});

	describe('valid property: check is css property is valid', function() {
		const validTest = lint.valid.bind(app);

		it ('false if property not valid', function() {
			assert.equal( false, validTest( 'marg 0 auto') );
			assert.equal( false, validTest( 'pad 0') );
			assert.equal( false, validTest( 'dog: irish-setter; }') );
			assert.equal( false, validTest( '{const name}') );
			assert.equal( false, validTest( 'div[attribute test]') );
			assert.equal( false, validTest( '::selects') );
		});

		it ('true if property is valid', function() {
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
	describe('var style check', function() {
		const varTest = lint.varStyle.bind(app);

		it('false if $ is missing', function() {
			assert.equal( false, varTest('myconst = 0') );
		});

		it('false if $ if block const', function() {
			assert.equal( false, varTest('myconst = @block') );
		});

		it('true if $ is found (and correct', function() {
			assert.equal( true, varTest('$myconst = 0') );
			assert.equal( true, varTest('$first-value = floor( (100% / $columns) * $index )') );
		});
	});

	describe('zero units', function() {
		const zeroTest = lint.zeroUnits.bind(app);

		it('false if 0 value is fine', function() {
			app.state.keyframes = false;
			assert.equal( false, zeroTest('margin 0') );
			assert.equal( false, zeroTest('margin 50px') );
		});

		it('true if 0 + any unit type is found (0 is preferred)', function() {
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

		it('undefined if in keyframes', function() {
			app.state.keyframes = true;
			assert.equal( undefined, zeroTest('from 0%') );
			assert.equal( undefined, zeroTest('0% {') );
			app.state.keyframes = false;
		});
	});

	describe('zIndex Duplicates', function() {
		const zDupeTest = lint.zIndexDuplicates.bind(app);

		it('false if z-index is not found on line', function() {
			assert.equal( false, zDupeTest('margin 0') );
		});

		it('false if z-index is unique', function() {
			assert.equal( false, zDupeTest('z-index 1230981241237') );
		});

		it('true if z-index is duplicated', function() {
			assert.equal( true, zDupeTest('z-index 0') );
		});

		it('zCache at this point should be greater than 0', function() {
			assert.equal( true, app.cache.zCache.length > 0 );
		})
	});

	describe('zIndex Normalizer', function() {
		const zNormalizrTest = lint.zIndexNormalize.bind(app);

		it('false if z index value already normalized', function() {
			app.config.zIndexNormalize = 5;
			assert.equal( false, zNormalizrTest('z-index 5') );
			assert.equal( false, zNormalizrTest('margin 0') );
		});

		it('true if z index value needs to be normalized', function() {
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

// 	it('an object', function() {
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
