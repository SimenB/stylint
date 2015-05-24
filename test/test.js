/**
 * UNIT TESTS
 * lets pull in what we're testing here
 */

const fs = require('fs');
const assert = require('assert');
const chokidar = require('chokidar');
const touch = require('touch');
const should = require('chai').should();
const sinon = require('sinon');
const app = require('../index');

// turn on strict mode from this point and turn off unecessary logging
app.state.quiet = true;
app.state.watching = true;
app.cache.dir = '/Users/ross/Developer/workspace/stylus-lint/';

describe('Core Methods: ', function() {

	beforeEach(function() {
		app.state.strictMode = false;
	});

	describe('Done: ', function() {
		it('should be a function', function() {
			app.done.should.be.a('function');
		});

		it('exit code of 1 if errs', function() {
			app.cache.warnings = [0,1,2,3,4,5];
			assert.equal( 1, app.done( app ).exitCode );
		});
	});

	describe('Init should: ', function() {
		sinon.spy( app, 'init' );

		it('be a function', function() {
			app.init.should.be.a('function');
		});

		it('set path if one passed in', function() {
			process.argv[2] = 'styl/';
			app.init();
			assert.equal( app.state.path,  'styl/' );
		});

		it('set path to cwd if none passed in', function() {
			process.argv[2] = undefined;
			app.init();
			assert.equal( app.state.path, process.cwd() );
		});

		it('return help if passed a -h flag', function() {
			process.argv[2] = '-h';
			app.init();
			app.init.getCall(2).returned( sinon.match.same( app.help ) );
		});

		it('return version if passed -v flag', function() {
			process.argv[2] = '-v';
			app.init();
			app.init.getCall(3).returned( sinon.match.same( app.ver ) );
		});

		it('toggle strict mode if passed -s flag', function() {
			process.argv[2] = '-s';
			app.init();
			assert.equal( true, app.state.strictMode );
			app.state.strictMode = false;
		});

		it('use custom config if passed -c flag', function() {
			process.argv[2] = '-c';
			process.argv[3] = './.stylintrc';
			app.init();
			assert.deepEqual( app.config, app.setConfig('./.stylintrc') );
		});

		it('use custom config if passed --config flag', function() {
			process.argv[2] = '--config';
			process.argv[3] = './.stylintrc';
			app.init();
			assert.deepEqual( app.config, app.setConfig('./.stylintrc') );
		});

		it('call watch if passed -w flag', function() {
			process.argv[2] = '-w';
			app.init();
			app.init.getCall(7).returned( sinon.match.same( app.watch ) );
		});

		it('return read if no flags', function() {
			process.argv[2] = undefined;
			app.init();
			app.init.getCall(8).returned( sinon.match.same( app.read ) );
		});
	});

	describe('Read: ', function() {
		sinon.spy( app, 'read' );

		it('should be a function', function() {
			app.read.should.be.a('function');
		});

		it('return parse function if passed a dir', function() {
			app.state.path = 'styl/';
			app.read();
			app.read.getCall(0).returned( sinon.match.same( app.parse ) );
		});

		it('return parse function if passed a filename', function() {
			app.state.path = 'styl/test2.styl';
			app.read();
			app.read.getCall(1).returned( sinon.match.same( app.parse ) );
		});

		it('return parse function if nothing passed', function() {
			app.state.path = process.cwd();
			app.read();
			app.read.getCall(2).returned( sinon.match.same( app.parse ) );
		});
	});

	describe('Parse should: ', function() {
		sinon.spy( app, 'parse' );

		it('be a function', function() {
			app.parse.should.be.a( 'function' );
		});

		it('return a forEach if passed a filename', function() {
			app.parse(false, ['styl/test2.styl']);
			app.parse.getCall(0).returned( sinon.match.same( ['styl/test2.styl'].forEach ) );
		});

		it('return a forEach if passed a list of files', function() {
			app.parse(false, ['styl/test2.styl, styl/test.styl']);
			app.parse.getCall(1).returned( sinon.match.same( ['styl/test2.styl, styl/test.styl'].forEach ) );
		});

		it('handle empty or one line files fine', function() {
			app.parse(false, ['styl/oneLine.styl']);
			app.parse.getCall(2).returned( sinon.match.same( ['styl/oneLine.styl'].forEach ) );
		});

		it('returns app.done when done parsing last file', function() {
			app.cache.fileNo = app.cache.filesLen;
			app.parse(false, ['styl/test2.styl']);
			app.parse.getCall(3).returned( sinon.match.same( app.done ) );
		});

		it('throws err if passed non-existant file name', function() {
			app.cache.file = undefined;
			assert.throws(
				app.parse,
				Error,
				'readFile err. Did you pass in a correct filename?'
			);
		});
	});

	describe('Lint: ', function() {
		sinon.spy( app, 'lint' );
		app.lint( app, '  margin 0 auto ', 5, 'margin 0 auto', 'styl/test2.styl' );

		it('should be a function', function() {
			app.lint.should.be.a( 'function' );
		});
	});

	describe('Watch: ', function() {
		sinon.spy( app, 'watch' );

		beforeEach(function() {
			app.watcher = undefined;
		})

		it('should be a function', function() {
			app.watch.should.be.a( 'function' );
		});

		it('watcher should be undefined if not called yet', function() {
			assert.equal( true, typeof app.watcher === 'undefined' );
		});

		it('should set watcher if called', function() {
			app.watch();
			assert.equal( true, typeof app.watcher !== 'undefined' );
		});

		it('should call ready event when fired', function() {
			app.watcher = chokidar.watch(app.state.path);
			app.watcher.on('ready', function() {
				assert(true);
			});
		});

		it('should call change event when file changed', function() {
			app.watcher = chokidar.watch('styl/test.styl');
			app.watcher.on('change', function() {
				assert(true);
			});
			touch('styl/test.styl');
		});
	});

	describe('Help: ', function() {
		sinon.spy( app, 'help' );

		it('should be a function', function() {
			app.help.should.be.a( 'function' );
		});

		it('undefined', function() {
			app.help( app );
			assert.equal( undefined, app.help.getCall(0).returnValue );
		});
	});

	describe('Version: ', function() {
		sinon.spy( app, 'ver' );

		it('should be a function', function() {
			app.ver.should.be.a( 'function' );
		});

		it('a console log function', function() {
			app.ver();
			app.ver.getCall(0).returned( sinon.match.same( fs.readFile ) );
		});
	});
});

describe('Utility Methods: ', function() {
	beforeEach(function() {
		app.state.strictMode = false;
	});

	describe('Set Config should:', function() {
		const testMethod = app.setConfig( '.stylintrc' );
		const testConfig = JSON.parse( fs.readFileSync( process.cwd() + '/.stylintrc' ) );

		it('update config state if passed a valid path', function() {
			assert.deepEqual( testMethod, testConfig );
		});

		it('throw if passed invalid path', function() {
			assert.throws(
				app.setConfig,
				TypeError,
				'setConfig err. Expected string, but received: ' + typeof dir
			);
		});
	});

	describe('Get Files should: ', function() {
		sinon.spy( app, 'getFiles' );

		it('return app.parse if passed directory', function() {
			app.getFiles( '/styl' );
			app.getFiles.getCall(0).returned( sinon.match.same( app.parse ) );
		});

		it('return undefined if passed filename', function() {
			assert.equal( undefined, app.getFiles( '/styl/test2.styl' ) );
		});

		it('throw if path is not a string', function() {
			assert.throws(
				app.getFiles,
				TypeError,
				'getFiles err. Expected string, but received: ' + typeof dir
			);
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
			app.config.emoji = false;
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

	describe('trim line should: ', function() {
		const trimTest = app.trimLine.bind(app);

		it ('do nothing if line has no comment', function() {
			assert.equal( '.noCommentOnThisLine ', trimTest('.noCommentOnThisLine ') );
		});

		it ('do nothing if comment is 1st character', function() {
			assert.equal( '// .noCommentOnThisLine ', trimTest('// .noCommentOnThisLine ') );
		});

		it ('trim comment if not first character', function() {
			assert.equal( '.noCommentOnThisLine', trimTest('.noCommentOnThisLine //') );
		});

		it ('trim interpolated variables', function() {
			assert.equal( '.test-', trimTest('.test-{interpolation}') );
		});
	});
})

describe('Linter Style Checks: ', function() {
	const lint = app.lintMethods;
	const state = app.stateMethods;

	beforeEach(function() {
		app.state.strictMode = true;
	});

	describe('blocks: prefer @block when defining block vars', function() {
		const blockTest = lint.blocks.bind(app);

		it('false if block style incorrect', function() {
			assert.equal( false, blockTest('myBlock = ') );
			assert.equal( false, blockTest('myBlock =') );
		});

		it('true if block style correct', function() {
			assert.equal( true, blockTest('myBlock = @block') );
			assert.equal( true, blockTest('myBlock = @block ') );
		});

		it('undefined if block style not applicable', function() {
			assert.equal( undefined, blockTest('.class') );
		});
	});

	describe('blocks: disallow @block when defining block vars', function() {
		const blockTest = lint.blocks.bind(app);

		beforeEach(function() {
			app.config.blocks = 'never';
		});

		it('false if block style IS correct', function() {
			assert.equal( false, blockTest('myBlock = ') );
			assert.equal( false, blockTest('myBlock =') );
		});

		it('true if block style NOT correct', function() {
			assert.equal( true, blockTest('myBlock = @block') );
			assert.equal( true, blockTest('myBlock = @block ') );
		});

		it('undefined if block style not applicable', function() {
			assert.equal( undefined, blockTest('.class') );
			assert.equal( undefined, blockTest('input[type="submit"]') );
		});
	});

	describe('brackets: always use brackets', function() {
		const bracketsTest = lint.brackets.bind(app);

		beforeEach(function() {
			app.config.brackets = 'always';
		});

		it('undefined if in hash', function() {
			app.state.hashOrCSS = true;
			assert.equal( undefined, bracketsTest('}') );
			assert.equal( undefined, bracketsTest('{interpolation}') );
			assert.equal( undefined, bracketsTest('.class-name-with-{i}') );
		});

		it('true if bracket found, not in hash', function() {
			app.state.hashOrCSS = false;
			app.state.openBracket = true;
			assert.equal( true, bracketsTest('.class-name {') );
			assert.equal( true, bracketsTest('#id {') );
		});

		it('false if no bracket found', function() {
			app.state.hashOrCSS = false;
			assert.equal( false, bracketsTest('.class-name') );
			assert.equal( false, bracketsTest('#id') );
		});
	});

	describe('brackets: disallow brackets', function() {
		const bracketsTest = lint.brackets.bind(app);

		beforeEach(function() {
			app.config.brackets = 'never';
		});

		it('undefined if in hash', function() {
			app.state.hashOrCSS = true;
			assert.equal( undefined, bracketsTest('}') );
			assert.equal( undefined, bracketsTest('{interpolation}') );
			assert.equal( undefined, bracketsTest('.class-name-with-{i}') );
		});

		it('true if bracket found, not in hash', function() {
			app.state.hashOrCSS = false;
			assert.equal( true, bracketsTest('.class-name {') );
			assert.equal( true, bracketsTest('div {') );
			assert.equal( true, bracketsTest('}') );
		});

		it('false if no bracket found', function() {
			app.state.hashOrCSS = false;
			assert.equal( false, bracketsTest('.class-name') );
			assert.equal( false, bracketsTest('div') );
		});
	});

	describe('brackets: incorrect config', function() {
		const bracketsTest = lint.brackets.bind(app);

		it('should return false', function() {
			app.config.brackets = 'something';
			assert.equal( false, bracketsTest('div {') );
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

		it('undefined if hex color is being assigned to a variable', function () {
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

		beforeEach(function() {
			app.state.hasComment = true;
		});

		it('false if line comment doesnt have a space after it', function() {
			app.cache.comment = '//test';
			assert.equal( false, commentSpaceTest('margin //test') );
			app.cache.comment = 'margin 0 auto //test';
			assert.equal( false, commentSpaceTest('margin 0 auto //test') );
		});

		it('true if line comment has space after it', function() {
			app.cache.comment = '// test';
			assert.equal( true, commentSpaceTest('// test') );
			app.cache.comment = 'margin 0 auto // test';
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
			app.state.hashOrCSS = false;
			assert.equal( false, cssTest('margin 0') );
			assert.equal( false, cssTest('@extends $placeholderconst') );
			assert.equal( false, cssTest('@require "lint.styl"') );
		});

		it('true if @css is used ', function() {
			assert.equal( true, cssTest('@css {') );
		});

		it('undefined if already in css literal', function() {
			app.state.hashOrCSS = true;
			assert.equal( undefined, cssTest('.test') );
		});
	});

	describe('depthLimit', function() {
		const nestTest = lint.depthLimit.bind(app);

		it('false if less indents than depth limit', function() {
			app.config.depthLimit = 4;
			app.config.indentPref = 4;
			app.state.context = app.setContext('margin 0');
			assert.equal( false, nestTest('margin 0') );
			app.state.context = app.setContext('			margin 0');
			assert.equal( false, nestTest('			margin 0') );
			app.state.context = app.setContext('    margin 0                             ');
			assert.equal( false, nestTest('			margin 0') );
			app.config.indentPref = 'tabs';
			app.state.context = app.setContext('&:hover');
			assert.equal( false, nestTest('&:hover') );
			assert.equal( false, nestTest('			&:hover') );
			app.state.context = app.setContext('.class-name');
			assert.equal( false, nestTest('.class-name') );
			assert.equal( false, nestTest('		.class-name								') );
		});

		it('true if more indents than depth limit', function() {
			app.config.depthLimit = 2;
			app.config.indentPref = 2;
			app.state.context = app.setContext('       margin 0');
			assert.equal( true, nestTest('       margin 0') );
			app.config.indentPref = 4;
			app.state.context = app.setContext('          margin 0');
			assert.equal( true, nestTest('          margin 0') );
			app.config.depthLimit = 4;
			app.state.context = app.setContext('                   margin 0');
			assert.equal( true, nestTest('                   margin 0') );
			app.config.indentPref = 'tabs';
			app.state.context = app.setContext('					margin 0');
			assert.equal( true, nestTest('					margin 0') );
			app.config.depthLimit = 1;
			app.state.context = app.setContext('		margin 0 )');
			assert.equal( true, nestTest('		margin 0 )') );
		});
	});

	describe('duplicates', function() {
		const dupeTest = lint.duplicates.bind(app);

		it('tabs: false if no dupe, not root, diff context, same selector', function() {
			app.config.indentPref = 'tabs';
			app.cache.file = 'file.styl';
			app.cache.prevFile = 'file.styl'
			app.state.context = app.setContext('	.test'); // 1
			dupeTest('	.test');
			app.state.context = app.setContext('			.test'); // 3
			assert.equal( false, dupeTest('			.test') );
		});

		it('tabs: false if globalDupe off, diff files, same context, same selector', function() {
			app.config.globalDupe = true;
			app.cache.prevFile = 'file5.styl';
			app.cache.file = 'file6.styl';
			app.state.context = app.setContext('	.test'); // 1
			app.state.context = app.setContext('	.test'); // 1
			assert.equal( false, dupeTest('	.test') );
			app.config.globalDupe = false;
		});

		it('tabs: false if prev selector was in a list, same file, same context, same selector', function() {
			app.cache.prevFile = 'file.styl';
			app.cache.file = 'file.styl';
			app.state.context = app.setContext('	.classy,'); // to set the context
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
			app.state.context = app.setContext('    .test'); // 1
			dupeTest('    .test');
			app.state.context = app.setContext('            .test'); // 3
			assert.equal( false, dupeTest('            .test') );
		});

		it('spaces: false if globalDupe off, diff files, same context, same selector', function() {
			app.config.globalDupe = true;
			app.cache.prevFile = 'file5.styl';
			app.cache.file = 'file6.styl';
			app.state.context = app.setContext('    .test'); // 1
			app.state.context = app.setContext('    .test'); // 1
			assert.equal( false, dupeTest('    .test') );
			app.config.globalDupe = false;
		});

		it('spaces: false if prev selector was in a list, same file, same context, same selector', function() {
			app.cache.prevFile = 'file.styl';
			app.cache.file = 'file.styl';
			app.state.context = app.setContext('    .classy,'); // to set the context
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
			app.state.context = '1';
			app.state.prevContext = '1';
			dupeTest('	.test');
			assert.equal( true, dupeTest('	.test') );
		});

		it('spaces: true if nested selector is dupe', function() {
			app.cache.prevFile = 'file.styl';
			app.cache.file = 'file.styl';
			app.state.context = '1';
			app.state.prevContext = '1';
			dupeTest('    .test2');
			assert.equal( true, dupeTest('    .test2') );
		});

		it('true if root selector is dupe, same file', function() {
			app.state.context = '0';
			app.state.prevContext = '0';
			dupeTest('.test3'); // to set the context
			assert.equal( true, dupeTest('.test3') );
		});

		it('true if root selector is dupe, global dupe test', function() {
			app.state.context = '0';
			app.state.prevContext = '0';
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
			app.config.extendPref = '@extends';
			assert.equal( false, extendTest('@extend $placeHolderconst') );
			app.config.extendPref = '@extend';
			assert.equal( false, extendTest('@extends $placeHolderconst') );
		});

		it('true if value matches preferred style', function() {
			app.config.extendPref = '@extend';
			assert.equal( true, extendTest('@extend $placeHolderconst') );
			app.config.extendPref = '@extends';
			assert.equal( true, extendTest('@extends $placeHolderconst') );
		});

		it('undefined if no extend on line', function() {
			assert.equal( undefined, extendTest('$const = #fff') );
		});
	});

	describe('hash start', function() {
		const hashTest = state.hashOrCSSStart.bind(app);

		beforeEach(function() {
			app.state.hashOrCSS = false;
		});

		it('false if hash start not found', function() {
			assert.equal( false, hashTest('$myconst =') );
			assert.equal( false, hashTest('myconst = @block') );
			assert.equal( false, hashTest('.mistakenUseOfBracket {') );
			assert.equal( false, hashTest('margin 0') );
		});

		it('true if = and { are found on the same line (hash start)', function() {
			assert.equal( true, hashTest('myHash = {') );
		});

		it('app.state.hashOrCSS should be true after hash start', function() {
			hashTest('myHash = {');
			assert.equal( true, app.state.hashOrCSS );
		});

		it('undefined if in a hash', function() {
			app.state.hashOrCSS = true;
			assert.equal( undefined, hashTest('myHash = {') );
		});
	});

	describe('hash end', function() {
		const hashTest = state.hashOrCSSEnd.bind(app);

		it('false if in hash and valid } found', function() {
			app.state.hashOrCSS = true;
			assert.equal( false, hashTest('}') );
		});

		it('true if hash end } not found', function() {
			app.state.hashOrCSS = true;
			assert.equal( true, hashTest('margin 0') );
			assert.equal( true, hashTest('myHash = {') );
		});

		it('after finding end of hash, hash state should equal false', function() {
			app.state.hashOrCSS = true;
			assert.equal( false, hashTest('}') );
			assert.equal( false, app.state.hash );
		});

		it('undefined if not in a hash', function() {
			app.state.hashOrCSS = false;
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

		afterEach(function() {
			app.state.keyframes = false;
		});

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
			app.config.indentPref = 4;
			assert.equal( false, mixed('    margin 0') );
		});

		it('false if no mixed spaces and tabs found: tabs preferred', function() {
			app.config.indentPref = 'tabs';
			assert.equal( false, mixed('	margin 0') );
		});

		it('true if spaces and tabs are mixed: spaces preferred', function() {
			app.config.indentPref = 4;
			assert.equal( true, mixed('	  margin 0') );
			assert.equal( true, mixed('	padding 0em') );
		});

		it('true if spaces and tabs are mixed: tabs preferred', function() {
			app.config.indentPref = 'tabs';
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

		beforeEach(function() {
			app.state.prevContext = 1;
			app.state.context = 1;
		});

		afterEach(function() {
			app.cache.sortOrderCache = [];
		});

		it('undefined if root level', function() {
			app.state.context = '0';
			assert.equal( undefined, sortTest('margin 0'));
		});

		it('cache length should only be 1 (the current prop) if context switched', function() {
			app.cache.sortOrderCache = [ 'border', 'margin', 'padding' ];
			app.state.prevContext = '0';
			app.state.context = '1';

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
				assert.equal( true, sortTest( '	background' ) );
				assert.equal( true, sortTest( '	z-index' ) );
				assert.equal( true, sortTest( '	border' ) );
				assert.equal( true, sortTest( '	width' ) );
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

	describe('valid property:', function() {
		const validTest = lint.valid.bind(app);

		beforeEach(function() {
			app.state.keyframes = false;
		})

		it ('true if from or to used INSIDE keyframes', function() {
			app.state.keyframes = true;
			assert.equal( true, validTest('from 0%') );
			assert.equal( true, validTest('to 100%') );
		});

		it ('false if property not valid', function() {
			assert.equal( false, validTest('marg 0 auto') );
			assert.equal( false, validTest('pad 0') );
			assert.equal( false, validTest('dog: irish-setter; }') );
			assert.equal( false, validTest('{const name}') );
			assert.equal( false, validTest('div[attribute test]') );
			assert.equal( false, validTest('::selects') );
			assert.equal( false, validTest('nonsense:active') );
		});

		it ('true if property is valid', function() {
			assert.equal( true, validTest('background') );
			assert.equal( true, validTest('border-bottom 0') );
			assert.equal( true, validTest('margin-top 0') );
			assert.equal( true, validTest('padding 0') );
			assert.equal( true, validTest('-webkit-border-radius 0') );
			assert.equal( true, validTest('input') );
			assert.equal( true, validTest('body') );
			assert.equal( true, validTest('::selection') );
			assert.equal( true, validTest('div:hover') );
			assert.equal( true, validTest('button:active') );
			assert.equal( true, validTest('p:optional') );
			assert.equal( true, validTest('div[attribute]') );
			assert.equal( true, validTest('background linear-gradient(to top, grey 50%, transparent 50%)') );
		});

		it ('true if class, id, interpolation, attribute, mixin etc', function() {
			assert.equal( true, validTest( '.el:hover') );
			assert.equal( true, validTest( '$const-name = ') );
			assert.equal( true, validTest( '{const-name}') );
			assert.equal( true, validTest( 'my-hash = {') );
			assert.equal( true, validTest( 'for i in 0..9') );
			assert.equal( true, validTest( '&--append-class-name') );
			assert.equal( true, validTest( '[data-js]') );
			assert.equal( true, validTest( '#id:hover') );
			assert.equal( true, validTest('transition( opacity )') );
		});

		it ('undefined if from or to used outside keyframes', function() {
			assert.equal( undefined, validTest( 'from 0%') );
			assert.equal( undefined, validTest( 'to 100%') );
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

	describe('zIndex Normalizer', function() {
		app.config.zIndexNormalize = 5;
		const zNormalizrTest = lint.zIndexNormalize.bind(app);

		it('false if z index value already normalized', function() {
			assert.equal( false, zNormalizrTest('z-index 5') );
		});

		it('false if no z-index', function() {
			assert.equal( false, zNormalizrTest('margin 5px') );
		});

		it('true if z index value needs to be normalized', function() {
			assert.equal( true, zNormalizrTest('z-index 4') );
		});

		it('undefined if 0 or -1', function() {
			assert.equal( undefined, zNormalizrTest('z-index -1') );
			assert.equal( undefined, zNormalizrTest('z-index 0') );
		});
	});
});

// describe('Done, again: ', function() {
// 	app.state.warnings = [];
// 	app.config.maxWarningsKill = true;

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
// 		assert.equal( true, app.done('kill').msg.indexOf('too many errors') !== -1 );
// 	});

// 	it('msg should be the too many errors message', function() {
// 		app.cache.warnings = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
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

// 	it('should exit if watch off', function() {
// 		sinon.spy( app, 'done' );
// 		const test;

// 		app.state.watching = false;
// 		test = app.done( app );

// 		app.done.getCall(0).returned( sinon.match.same( process.exit ) );
// 		app.state.watching = true;
// 	});
// });
