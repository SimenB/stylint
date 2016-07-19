'use strict';

/**
 * UNIT TESTS
 * lets pull in what we're testing here
 */

const fs = require('fs');
const assert = require('assert');
require('chai').should(); // add should assertions on top
const chokidar = require('chokidar');
const touch = require('touch');
const sinon = require('sinon');
const chalk = require('chalk');
const stylint = require('../index');
const stripJsonComments = require('strip-json-comments');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;
app.cache.dir = '/Users/ross/Developer/workspace/stylus-lint/';

describe('Core Methods: ', () => {
  beforeEach(() => {
    app.state.strictMode = false;
  });

  describe('Done: ', () => {
    it('should be a function', () => {
      app.done.should.be.a('function');
    });
  });

  // describe( 'Init should: ', function() {
  //   sinon.spy( app, 'init' )

  //   it( 'be a function', function() {
  //     app.init.should.be.a( 'function' )
  //   } )

  //   it( 'set path if one passed in', function() {
  //     app.state.path = null
  //     app.init( null, 'test-styl/' )
  //     assert.equal( app.state.path, 'test-styl/' )
  //   } )

  //   it( 'set path if state.path is set', function() {
  //     app.state.path = 'test-styl/'
  //     app.init()
  //     assert.equal( app.state.path, 'test-styl/' )
  //   } )

  //   it( 'override state.path if one is passed in', function() {
  //     app.state.path = 'test-styl/'
  //     app.init( null, 'test-styl/test2.styl' )
  //     assert.equal( app.state.path, 'test-styl/test2.styl' )
  //   } )

  //   it( 'set path to cwd if none passed in', function() {
  //     app.state.path = null
  //     app.init()
  //     assert.equal( app.state.path, process.cwd() )
  //   } )

  //   it( 'set reporter if default if one not passed in', function() {
  //     app.config.reporter = undefined
  //     app.init()
  //     assert.ok( app.reporter !== false )
  //   } )

  //   it( 'use custom config if passed --config flag', function() {
  //     app.init( {
  //       config: './.stylintrc'
  //     } )
  //     assert.deepEqual( app.config, app.setConfig( './.stylintrc' ) )
  //   } )

  //   it( 'call watch if passed --watch flag', function() {
  //     app.init( {
  //       watch: true
  //     } )
  //     app.init.getCall( 3 ).returned( sinon.match.same( app.watch ) )
  //   } )

  //   it( 'return read if no flags', function() {
  //     app.init()
  //     app.init.getCall( 4 ).returned( sinon.match.same( app.read ) )
  //   } )
  // } )

  // describe( 'Read: ', function() {
  //   sinon.spy( app, 'read' )

  //   it( 'should be a function', function() {
  //     app.read.should.be.a( 'function' )
  //   } )

  //   it( 'return parse function if passed a dir', function() {
  //     app.state.path = 'test-styl/'
  //     app.read()
  //     app.read.getCall( 0 ).returned( sinon.match.same( app.parse ) )
  //   } )

  //   it( 'return parse function if passed a filename', function() {
  //     app.state.path = 'test-styl/test2.styl'
  //     app.read()
  //     app.read.getCall( 1 ).returned( sinon.match.same( app.parse ) )
  //   } )

  //   it( 'return parse function if nothing passed', function() {
  //     app.state.path = process.cwd()
  //     app.read()
  //     app.read.getCall( 2 ).returned( sinon.match.same( app.parse ) )
  //   } )
  // } )

  // describe( 'Parse should: ', function() {
  //   sinon.spy( app, 'parse' )

  //   it( 'be a function', function() {
  //     app.parse.should.be.a( 'function' )
  //   } )

  //   it( 'throws err if passed non-existant file name', function() {
  //     app.cache.file = undefined
  //     assert.throws(
  //       app.parse,
  //       TypeError,
  //       'readFile err. Did you pass in a correct filename?'
  //     )
  //   } )

  //   it( 'return a forEach if passed a filename', function() {
  //     app.parse( false, ['test-styl/test2.styl'] )
  //     app.parse.getCall( 0 ).returned( sinon.match.same( ['test-styl/test2.styl'].forEach ) )
  //   } )

  //   it( 'return a forEach if passed a list of files', function() {
  //     app.parse( false, ['test-styl/test2.styl, styl/test.styl'] )
  //     app.parse.getCall( 1 ).returned( sinon.match.same( ['test-styl/test2.styl, styl/test.styl'].forEach ) )
  //   } )

  //   it( 'handle empty or one line files fine', function() {
  //     app.parse( false, ['test-styl/oneLine.styl'] )
  //     app.parse.getCall( 2 ).returned( sinon.match.same( ['test-styl/oneLine.styl'].forEach ) )
  //   } )

  //   it( 'returns app.done when done parsing last file', function() {
  //     app.cache.fileNo = app.cache.filesLen
  //     app.parse( false, ['test-styl/test2.styl'] )
  //     app.parse.getCall( 3 ).returned( sinon.match.same( app.done ) )
  //   } )
  // } )

  describe('Lint: ', () => {
    sinon.spy(app, 'lint');

    afterEach(() => {
      app.config.maxErrors = false;
      app.config.maxWarnings = false;
      app.cache.messages = [];
      app.cache.brackets = false;
    });

    it('should be a function', () => {
      app.lint.should.be.a('function');
    });

    it('should pick up severity of current check', () => {
      app.config.brackets = {
        expect: 'never',
        error: true,
      };

      app.lint();
      app.lint.getCall(0).returned(sinon.match.same(app.done));
    });

    it('should return done if over maxErrs', () => {
      app.config.maxErrors = 5;
      app.cache.messages.length = 6;
      app.lint();
      app.lint.getCall(1).returned(sinon.match.same(app.done));
    });

    it('should return done if over maxWarnings', () => {
      app.config.maxWarnings = 5;
      app.cache.messages.length = 6;
      app.lint();
      app.lint.getCall(2).returned(sinon.match.same(app.done));
    });

    it('should cache rule name as one of warning properties', () => {
      app.config = { brackets: 'never' };
      app.lint();
      assert.equal(app.cache.rule, 'brackets');

      app.config = { leadingZero: 'never' };
      app.lint();
      assert.equal(app.cache.rule, 'leadingZero');

      // restore config
      app.config = app.setConfig();
    });
  });

  describe('Watch: ', () => {
    sinon.spy(app, 'watch');

    beforeEach(() => {
      app.watcher = undefined;
    });

    it('should be a function', () => {
      app.watch.should.be.a('function');
    });

    it('watcher should be undefined if not called yet', () => {
      assert.ok(typeof app.watcher === 'undefined');
    });

    it('should set watcher if called', () => {
      app.watch();
      assert.ok(typeof app.watcher !== 'undefined');
    });

    it('should call ready event when fired', () => {
      app.watcher = chokidar.watch(app.state.path);
      app.watcher.on('ready', () => {
        assert(true);
      });
    });

    it('should call change event when file changed', () => {
      app.watcher = chokidar.watch('test-styl/test.styl');
      app.watcher.on('change', () => {
        assert(true);
      });
      touch('test-styl/test.styl');
    });
  });

  describe('Reporter should: ', () => {
    sinon.spy(app, 'reporter');

    it('be a function', () => {
      app.reporter.should.be.a('function');
    });

    it('return correctly formatted msg', () => {
      app.cache.rule = 'universal';
      const expectedOutput = 'testReporter\n1 universal warning universal disallowed\n\nStylint: 0 Errors.\nStylint: 1 Warnings.';

      const msg = {
        filePath: 'testReporter',
        messages: [{
          message: 'universal disallowed',
          severity: 'warning',
          line: 1,
          column: 0,
          ruleId: 'universal',
          source: 'Reporter Lyfe*',
        }],
      };

      assert.equal(chalk.stripColor(app.reporter({
        results: [msg],
        errorCount: 0,
        warningCount: 1,
      })), expectedOutput);
    });
  });

  describe('setState should: ', () => {
    it('be a function', () => {
      app.setState.should.be.a('function');
    });

    it('return undefined if line empty', () => {
      /* eslint-disable no-useless-escape */
      // app.reporter( 'universal disallowed' )
      assert.equal(undefined, app.setState(''));
      assert.equal(undefined, app.setState(' '));
      assert.equal(undefined, app.setState('\t\t'));
      assert.equal(undefined, app.setState('\s\s'));
      assert.equal(undefined, app.setState('\s\t'));
      /* eslint-enable */
    });

    it('return undefined if @stylint ignore comment', () => {
      assert.equal(undefined, app.setState('margin 0 // @stylint ignore'));
    });

    it('return undefined if @stylint off comment', () => {
      app.cache.source = '// @stylint off';
      assert.equal(undefined, app.setState('// @stylint off'));
    });

    it('testsEnabled should set to false now', () => {
      assert.equal(false, app.state.testsEnabled);
    });

    it('return undefined if @stylint on comment', () => {
      app.cache.source = '// @stylint on';
      assert.equal(undefined, app.setState('// @stylint on'));
    });

    it('testsEnabled should set to true now', () => {
      assert.ok(app.state.testsEnabled);
    });

    it('return undefined if hash starting', () => {
      assert.equal(undefined, app.setState('my-hash = {'));
    });

    it('hashOrCSS should be set to true now', () => {
      assert.ok(app.state.hashOrCSS);
    });

    it('return undefined if hash ending', () => {
      app.state.testsEnabled = true;
      assert.equal(undefined, app.setState('}'));
    });

    it('hashOrCSS should be set to false now', () => {
      assert.equal(false, app.state.hashOrCSS);
    });

    it('return undefined if keyframes starting', () => {
      assert.equal(undefined, app.setState('@keyframes'));
    });

    it('keyframes should be set to true now', () => {
      assert.ok(app.state.keyframes);
    });

    it('return undefined if keyframes ending', () => {
      assert.equal(undefined, app.setState(''));
    });

    it('keyframes should be set to false now', () => {
      assert.equal(false, app.state.keyframes);
    });

    it('return undefined if line is just a comment', () => {
      assert.equal(undefined, app.setState('// stuff about this code'));
    });
  });
});

describe('Utility Methods: ', () => {
  beforeEach(() => {
    app.state.strictMode = false;
  });

  describe('Set Config should:', () => {
    process.argv[2] = '-c';
    process.argv[3] = '.stylintrc';
    const testMethod = app.setConfig('.stylintrc');
    const testConfig = JSON.parse(stripJsonComments(fs.readFileSync(`${process.cwd()}/.stylintrc`, 'utf-8')));

    it('update config state if passed a valid path', () => {
      assert.deepEqual(testMethod, testConfig);
    });

    it('throw if passed invalid path', () => {
      assert.throws(
        app.setConfig,
        TypeError,
        `setConfig err. Expected string, but received: ${typeof dir}`
      );
    });
  });

  describe('Get Files should: ', () => {
    sinon.spy(app, 'getFiles');

    it('return app.parse if passed directory', () => {
      app.getFiles('/styl');
      app.getFiles.getCall(0).returned(sinon.match.same(app.parse));
    });

    it('return app.parse if passed filename', () => {
      app.getFiles('/styl/test2.styl');
      app.getFiles.getCall(1).returned(sinon.match.same(app.parse));
    });

    it('return app.parse if passed array of files', () => {
      app.getFiles(['/styl/test2.styl']);
      app.getFiles.getCall(2).returned(sinon.match.same(app.parse));
    });
  });

  describe('Reset (after change)', () => {
    const resetTest = app.resetOnChange.bind(app);

    beforeEach(() => {
      app.state.watching = false;
    });

    it('reset on change should change dir to curr file', () => {
      resetTest('../styl/_ads.styl');
      assert.ok(app.state.path === '../styl/_ads.styl');
    });

    it('reset should reset all caches', () => {
      resetTest('../styl/_ads.styl');
      assert.ok(
        Object.keys(app.cache.sCache).length === 0 &&
        app.cache.alphaCache.length === 0 &&
        app.cache.rootCache.length === 0 &&
        app.cache.prevLine.length === 0 &&
        app.cache.prevFile.length === 0 &&
        app.cache.prevContext === 0 &&
        app.cache.zCache.length === 0
      );
    });

    it('reset should set prevLine and prevFile to empty strings', () => {
      resetTest('../styl/_ads.styl');
      assert.ok(
        app.cache.prevLine === '' &&
        app.cache.prevFile === ''
      );
    });

    it('reset should set prevContext to 0', () => {
      resetTest('../styl/_ads.styl');
      assert.ok(app.cache.prevContext === 0);
    });
  });

  describe('trim line should: ', () => {
    const trimTest = app.trimLine.bind(app);

    it('do nothing if line has no comment', () => {
      assert.equal('.noCommentOnThisLine ', trimTest('.noCommentOnThisLine '));
    });

    it('do nothing if comment is 1st character', () => {
      assert.equal('// .noCommentOnThisLine ', trimTest('// .noCommentOnThisLine '));
    });

    it('trim comment if not first character', () => {
      assert.equal('.noCommentOnThisLine', trimTest('.noCommentOnThisLine //'));
    });

    it('trim interpolated variables', () => {
      assert.equal('.test-', trimTest('.test-{interpolation}'));
    });
  });
});

describe('Linter Style Checks: ', () => {
  const lint = app.lintMethods;

  beforeEach(() => {
    app.state.strictMode = true;
    app.state.conf = 'always';
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  describe('blocks: prefer @block when defining block vars', () => {
    const blockTest = lint.blocks.bind(app);

    it('false if block style incorrect', () => {
      assert.equal(false, blockTest('myBlock = '));
      assert.equal(false, blockTest('myBlock ='));
    });

    it('true if block style correct', () => {
      assert.ok(blockTest('myBlock = @block'));
      assert.ok(blockTest('myBlock = @block '));
    });

    it('undefined if block style not applicable', () => {
      assert.equal(undefined, blockTest('.class'));
    });
  });

  describe('blocks: disallow @block when defining block vars', () => {
    const blockTest = lint.blocks.bind(app);

    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if block style IS correct', () => {
      assert.equal(false, blockTest('myBlock = '));
      assert.equal(false, blockTest('myBlock ='));
    });

    it('true if block style NOT correct', () => {
      assert.ok(blockTest('myBlock = @block'));
      assert.ok(blockTest('myBlock = @block '));
    });

    it('undefined if block style not applicable', () => {
      assert.equal(undefined, blockTest('.class'));
      assert.equal(undefined, blockTest('input[type="submit"]'));
    });
  });

  describe('brackets: always use brackets', () => {
    const bracketsTest = lint.brackets.bind(app);

    beforeEach(() => {
      app.state.conf = 'always';
      app.state.hashOrCSS = false;
      app.state.openBracket = false;
    });

    it('false if no bracket found', () => {
      assert.equal(false, bracketsTest('.class-name'));
      assert.equal(false, bracketsTest('#id'));
      assert.equal(false, bracketsTest('body.main'));
      assert.equal(false, bracketsTest('+ span'));
    });

    it('true if bracket found', () => {
      assert.ok(bracketsTest('body {'));
      assert.ok(bracketsTest('+ span {'));
      assert.ok(bracketsTest('div.div {'));
      assert.ok(bracketsTest('.class-name {'));
      assert.ok(bracketsTest('#id {'));
    });

    it('true if hash', () => {
      app.state.hashOrCSS = true;
      assert.equal(undefined, bracketsTest('.something'));
    });

    it('undefined if css or ,$ or } or =', () => {
      assert.equal(undefined, bracketsTest('.my-class,'));
      assert.equal(undefined, bracketsTest('margin 0'));
      assert.equal(undefined, bracketsTest('pointer-events none'));
      assert.equal(undefined, bracketsTest('}'));
      assert.equal(undefined, bracketsTest('$b = { "bar": "baz" }'));
      assert.equal(undefined, bracketsTest('{ "foo" }'));
      assert.equal(undefined, bracketsTest('{foo() + "bar"}'));
      assert.equal(undefined, bracketsTest('$foo = {'));
      assert.equal(undefined, bracketsTest('$foo-color ?= #0976b5;'));
      assert.equal(undefined, bracketsTest('$x += $i;'));
    });
    it('undefined if empty', () => {
      assert.equal(undefined, bracketsTest('  '));
    });
  });

  describe('brackets: disallow brackets', () => {
    const bracketsTest = lint.brackets.bind(app);

    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if no bracket found', () => {
      app.state.hashOrCSS = false;
      assert.equal(false, bracketsTest('.class-name'));
      assert.equal(false, bracketsTest('div'));
    });

    it('false if incorrect config', () => {
      app.state.conf = 'something';
      assert.equal(false, bracketsTest('div {'));
    });

    it('true if bracket found, not in hash', () => {
      app.state.hashOrCSS = false;
      assert.ok(bracketsTest('.class-name {'));
      assert.ok(bracketsTest('div {'));
      assert.ok(bracketsTest('}'));
    });

    it('undefined if in hash or syntax', () => {
      app.state.hashOrCSS = true;
      assert.equal(undefined, bracketsTest('}'));
      assert.equal(undefined, bracketsTest('{'));
      assert.equal(undefined, bracketsTest('{interpolation}'));
      assert.equal(undefined, bracketsTest('.class-name-with-{i}'));
      assert.equal(undefined, bracketsTest('$b = { "bar": "baz" }'));
      assert.equal(undefined, bracketsTest('{ "foo" }'));
      assert.equal(undefined, bracketsTest('{foo() + "bar"}'));
      assert.equal(undefined, bracketsTest('$foo = {'));
      assert.equal(undefined, bracketsTest('$foo-color ?= #0976b5;'));
      assert.equal(undefined, bracketsTest('$x += $i;'));
    });
  });

  describe('colon never: prefer margin 0 over margin: 0', () => {
    const colonTest = lint.colons.bind(app);

    beforeEach(() => {
      app.state.conf = 'never';
    });

    afterEach(() => {
      app.state.hash = false;
    });

    it('true if unnecessary colon is found', () => {
      app.state.context = 1;
      app.state.hash = false;
      assert.ok(colonTest('margin: 0 auto'));
    });

    it('undefined if html', () => {
      assert.equal(undefined, colonTest('div'));
    });

    it('undefined if no colon found', () => {
      assert.equal(undefined, colonTest('margin 0 auto'));
      assert.equal(undefined, colonTest('&:hover'));
    });

    it('undefined if root context', () => {
      app.state.context = 0;
      assert.equal(undefined, colonTest('margin 0 auto'));
      app.state.hash = true;
      assert.equal(undefined, colonTest('key: value'));
    });

    it('undefined if hash', () => {
      app.state.hash = true;
      assert.equal(undefined, colonTest('key: value'));
    });

    it('undefined if syntax or css selector', () => {
      assert.equal(undefined, colonTest('#id'));
      assert.equal(undefined, colonTest('$.some-class'));
      assert.equal(undefined, colonTest('> child selector'));
      assert.equal(undefined, colonTest('.class-name'));
      assert.equal(undefined, colonTest('for ( 0..9 )'));
      assert.equal(undefined, colonTest('@media $med'));
      assert.equal(undefined, colonTest('if ( $var == 50px )'));
      assert.equal(undefined, colonTest('hash = {'));
      assert.equal(undefined, colonTest('}'));
      assert.equal(undefined, colonTest('.class-name a'));
      assert.equal(undefined, colonTest('&.class-name a'));
      assert.equal(undefined, colonTest('&:active'));
      assert.equal(undefined, colonTest('return: $value'));
      assert.equal(undefined, colonTest('return $value'));
      assert.equal(undefined, colonTest('@media screen and (max-width: 1183px)'));
    });
  });

  describe('colon always: prefer margin: 0 over margin 0', () => {
    const colonTest = lint.colons.bind(app);

    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('false if no colon is found', () => {
      app.state.context = 1;
      assert.equal(false, colonTest('margin 0 auto'));
    });

    it('undefined if html', () => {
      assert.equal(undefined, colonTest('div'));
    });

    it('undefined if root context', () => {
      app.state.context = 0;
      assert.equal(undefined, colonTest('margin: 0 auto'));
    });

    it('undefined if colon found', () => {
      assert.equal(undefined, colonTest('background-image: '));
      assert.equal(undefined, colonTest('margin: 0 auto'));
      assert.equal(undefined, colonTest('margin: 0 auto;'));
    });

    it('undefined if syntax or css selector', () => {
      assert.equal(undefined, colonTest('#id'));
      assert.equal(undefined, colonTest('$.some-class'));
      assert.equal(undefined, colonTest('> child selector'));
      assert.equal(undefined, colonTest('.class-name'));
      assert.equal(undefined, colonTest('for ( 0..9 )'));
      assert.equal(undefined, colonTest('@media $med'));
      assert.equal(undefined, colonTest('@extend $med'));
      assert.equal(undefined, colonTest('@extends $med'));
      assert.equal(undefined, colonTest('@import _some-file'));
      assert.equal(undefined, colonTest('.class-name, #id-name'));
      assert.equal(undefined, colonTest('.class-name + #id-name'));
      assert.equal(undefined, colonTest('p ~ ul'));
      assert.equal(undefined, colonTest('p > ul'));
      assert.equal(undefined, colonTest('if ( $var == 50px )'));
      assert.equal(undefined, colonTest('hash = {'));
      assert.equal(undefined, colonTest('}'));
      assert.equal(undefined, colonTest('.class-name a'));
      assert.equal(undefined, colonTest('&.class-name a'));
      assert.equal(undefined, colonTest('&:active'));
      assert.equal(undefined, colonTest('return: $value'));
      assert.equal(undefined, colonTest('return $value'));
      assert.equal(undefined, colonTest('@media screen and (max-width: 1183px)'));
    });
  });

  describe('colors', () => {
    const colorsTest = lint.colors.bind(app);

    beforeEach(() => {
      app.state.conf = true;
    });

    it('undefined if line is an id selector', () => {
      assert.equal(undefined, colorsTest('#aaa'));
    });

    it('false if a line doesnt have a hex color', () => {
      assert.equal(false, colorsTest('color: red'));
    });

    it('true if line has hex color', () => {
      assert.ok(colorsTest('color: #fff'));
    });

    it('undefined if hex color is being assigned to a variable', () => {
      assert.equal(undefined, colorsTest('$foobar ?= #fff'));
      assert.equal(undefined, colorsTest('$foobar = #fff'));
    });
  });

  describe('comma space: prefer space after commas', () => {
    const commaTest = lint.commaSpace.bind(app);

    it('false if space after comma, or comma in quotes', () => {
      assert.equal(false, commaTest('', '0, 0, 0, .18'));
      assert.equal(false, commaTest('', '0,0, 0, .18'));
      assert.equal(false, commaTest('', 'content: ","'));
    });

    it('true if no space after commas', () => {
      assert.ok(commaTest('', '0,0,0,.18'));
      assert.ok(commaTest('', 'mixin( $param1,$param2 )'));
    });

    it('undefined if no comma on line', () => {
      assert.equal(undefined, commaTest('', 'margin 0'));
    });

    it('undefined if comma is last character', () => {
      assert.equal(undefined, commaTest('', '.class,'));
    });
  });

  describe('comma space: prefer NO space after commas', () => {
    const commaTest = lint.commaSpace.bind(app);

    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if space after comma', () => {
      assert.equal(false, commaTest('', '0, 0, 0, .18'));
      assert.equal(false, commaTest('', '0,0, 0, .18'));
    });

    it('true if no space after commas', () => {
      assert.ok(commaTest('', '0,0,0,.18'));
      assert.ok(commaTest('', 'mixin( $param1,$param2 )'));
    });

    it('undefined if no comma on line', () => {
      assert.equal(undefined, commaTest('', 'margin 0'));
    });

    it('undefined if comma is last character', () => {
      assert.equal(undefined, commaTest('', '.class,'));
    });
  });

  describe('comment space: prefer spaces after line comments', () => {
    const commentSpaceTest = lint.commentSpace.bind(app);

    beforeEach(() => {
      app.state.hasComment = true;
    });

    it('false if line comment doesnt have a space after it', () => {
      app.cache.comment = '//test';
      assert.equal(false, commentSpaceTest('', ''));
    });

    it('true if line comment has space after it', () => {
      app.cache.comment = '// test';
      assert.ok(commentSpaceTest('', ''));
    });

    it('undefined if line has no comment', () => {
      app.state.hasComment = false;
      assert.equal(undefined, commentSpaceTest('', '.test'));
    });
  });

  describe('comment space: prefer NO spaces after line comments', () => {
    const commentSpaceTest = lint.commentSpace.bind(app);

    beforeEach(() => {
      app.state.hasComment = true;
      app.state.conf = 'never';
    });

    it('false if line comment doesnt have a space after it', () => {
      app.cache.comment = '//test';
      assert.equal(false, commentSpaceTest('', ''));
    });

    it('true if line comment has space after it', () => {
      app.cache.comment = '// test';
      assert.ok(commentSpaceTest('', ''));
    });

    it('undefined if line has no comment', () => {
      app.state.hasComment = false;
      assert.equal(undefined, commentSpaceTest('', '.test'));
    });
  });

  describe('css literal', () => {
    const cssTest = lint.cssLiteral.bind(app);

    it('false if @css is not used', () => {
      app.state.hashOrCSS = false;
      assert.equal(false, cssTest('margin 0'));
      assert.equal(false, cssTest('@extends $placeholderconst'));
      assert.equal(false, cssTest('@require "lint.styl"'));
    });

    it('true if @css is used ', () => {
      assert.ok(cssTest('@css {'));
    });

    it('undefined if already in css literal', () => {
      app.state.hashOrCSS = true;
      assert.equal(undefined, cssTest('.test'));
    });
  });

  describe('depthLimit', () => {
    const nestTest = lint.depthLimit.bind(app);

    it('false if less indents than depth limit', () => {
      app.config.depthLimit = 4;
      app.config.indentPref = 4;
      app.state.context = app.setContext('margin 0');
      assert.equal(false, nestTest('margin 0'));
      app.state.context = app.setContext('      margin 0');
      assert.equal(false, nestTest('      margin 0'));
      app.state.context = app.setContext('    margin 0                             ');
      assert.equal(false, nestTest('      margin 0'));
      app.config.indentPref = 'tabs';
      app.state.context = app.setContext('&:hover');
      assert.equal(false, nestTest('&:hover'));
      assert.equal(false, nestTest('      &:hover'));
      app.state.context = app.setContext('.class-name');
      assert.equal(false, nestTest('.class-name'));
      assert.equal(false, nestTest('    .class-name                '));
    });

    it('true if more indents than depth limit', () => {
      app.config.depthLimit = 2;
      app.config.indentPref = 2;
      app.state.context = app.setContext('       margin 0');
      assert.ok(nestTest('       margin 0'));
      app.config.indentPref = 4;
      app.state.context = app.setContext('          margin 0');
      assert.ok(nestTest('          margin 0'));
      app.config.depthLimit = 4;
      app.state.context = app.setContext('                   margin 0');
      assert.ok(nestTest('                   margin 0'));
      app.config.indentPref = 'tabs';
      app.state.context = app.setContext('          margin 0');
      assert.ok(nestTest('          margin 0'));
      app.config.depthLimit = 1;
      app.state.context = app.setContext('    margin 0 )');
      assert.ok(nestTest('    margin 0 )'));
    });
  });

  describe('duplicates', () => {
    const dupeTest = lint.duplicates.bind(app);

    it('tabs: false if no dupe, not root, diff context, same selector', () => {
      app.config.indentPref = 'tabs';
      app.cache.file = 'file.styl';
      app.cache.prevFile = 'file.styl';
      app.state.context = app.setContext('  .test'); // 1
      dupeTest('  .test');
      app.state.context = app.setContext('      .test'); // 3
      assert.equal(false, dupeTest('      .test'));
    });

    it('tabs: false if globalDupe off, diff files, same context, same selector', () => {
      app.config.globalDupe = true;
      app.cache.prevFile = 'file5.styl';
      app.cache.file = 'file6.styl';
      app.state.context = app.setContext('  .test'); // 1
      app.state.context = app.setContext('  .test'); // 1
      assert.equal(false, dupeTest('  .test'));
      app.config.globalDupe = false;
    });

    it('tabs: false if prev selector was in a list, same file, same context, same selector', () => {
      app.cache.prevFile = 'file.styl';
      app.cache.file = 'file.styl';
      app.state.context = app.setContext('  .classy,'); // to set the context
      dupeTest('  .classy,'); // prev selecto
      assert.equal(false, dupeTest('  .classy'));
    });

    it('tabs: false if selector is in a list', () => {
      assert.equal(false, dupeTest('  .classy,'));
    });

    it('tabs: false if global dupe off and file changed', () => {
      dupeTest('  .test4'); // to set the context
      app.cache.prevFile = 'file.styl';
      app.cache.file = 'file2.styl';
      app.config.globalDupe = false;
      assert.equal(false, dupeTest('  .test4'));
    });

    it('spaces: false if no dupe, not root, diff context, same selector', () => {
      app.config.indentPref = 4;
      app.cache.file = 'file.styl';
      app.cache.prevFile = 'file.styl';
      app.state.context = app.setContext('    .test'); // 1
      dupeTest('    .test');
      app.state.context = app.setContext('            .test'); // 3
      assert.equal(false, dupeTest('            .test'));
    });

    it('spaces: false if globalDupe off, diff files, same context, same selector', () => {
      app.config.globalDupe = true;
      app.cache.prevFile = 'file5.styl';
      app.cache.file = 'file6.styl';
      app.state.context = app.setContext('    .test'); // 1
      app.state.context = app.setContext('    .test'); // 1
      assert.equal(false, dupeTest('    .test'));
      app.config.globalDupe = false;
    });

    it('spaces: false if prev selector was in a list, same file, same context, same selector', () => {
      app.cache.prevFile = 'file.styl';
      app.cache.file = 'file.styl';
      app.state.context = app.setContext('    .classy,'); // to set the context
      dupeTest('    .classy,'); // prev selector
      assert.equal(false, dupeTest('    .classy'));
    });

    it('spaces: false if selector is in a list', () => {
      assert.equal(false, dupeTest('    .classy,'));
    });

    it('space: false if global dupe off and file changed', () => {
      dupeTest('    .test4'); // to set the context
      app.cache.prevFile = 'file.styl';
      app.cache.file = 'file2.styl';
      app.config.globalDupe = false;
      assert.equal(false, dupeTest('    .test4'));
    });

    it('false if root selector dupe was in list', () => {
      app.state.context = 0;
      app.state.prevContext = 0;
      app.config.globalDupe = false;
      app.cache.file = 'file.styl';
      dupeTest('.test,'); // to set the context
      assert.equal(false, dupeTest('.test'));
    });

    it('tabs: true if nested selector is dupe', () => {
      app.cache.prevFile = 'file.styl';
      app.cache.file = 'file.styl';
      app.state.context = 1;
      app.state.prevContext = 1;
      dupeTest('  .test');
      assert.ok(dupeTest('  .test'));
    });

    it('spaces: true if nested selector is dupe', () => {
      app.cache.prevFile = 'file.styl';
      app.cache.file = 'file.styl';
      app.state.context = 1;
      app.state.prevContext = 1;
      dupeTest('    .test2');
      assert.ok(dupeTest('    .test2'));
    });

    it('true if root selector is dupe, same file', () => {
      app.state.context = 0;
      app.state.prevContext = 0;
      dupeTest('.test3'); // to set the context
      assert.ok(dupeTest('.test3'));
    });

    it('true if root selector is dupe, global dupe test', () => {
      app.state.context = 0;
      app.state.prevContext = 0;
      app.config.globalDupe = true;
      app.cache.prevFile = 'file.styl';
      dupeTest('.test'); // to set the context
      app.cache.file = 'file2.styl';
      assert.ok(dupeTest('.test'));
      app.config.globalDupe = false;
    });
  });

  describe('efficient: prefer margin 0 over margin 0 0 0 0', () => {
    const efficientTest = lint.efficient.bind(app);

    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('false if value is not efficient', () => {
      assert.equal(false, efficientTest('margin 0 0 0 0'));
      assert.equal(false, efficientTest('margin 0 0 0'));
      assert.equal(false, efficientTest('margin 0 0'));
      assert.equal(false, efficientTest('margin 0 5px 0 5px'));
      assert.equal(false, efficientTest('margin 5px 0 5px'));
      assert.equal(false, efficientTest('margin 5px 0 5px 0'));
      assert.equal(false, efficientTest('margin 0 5px 0'));
      assert.equal(false, efficientTest('margin 0 5px 5px 5px'));
      assert.equal(false, efficientTest('padding 0 0 0 0'));
      assert.equal(false, efficientTest('padding 0 0 0'));
      assert.equal(false, efficientTest('padding 0 0'));
      assert.equal(false, efficientTest('padding 0 5px 0 5px'));
      assert.equal(false, efficientTest('padding 5px 0 5px'));
      assert.equal(false, efficientTest('padding 5px 0 5px 0'));
      assert.equal(false, efficientTest('padding 0 5px 0'));
      assert.equal(false, efficientTest('padding 0 5px 5px 5px'));
    });

    it('true if value is efficient', () => {
      assert.ok(efficientTest('margin 0 5px'));
      assert.ok(efficientTest('margin: 5px 0'));
      assert.ok(efficientTest('margin 5px 0 0'));
      assert.ok(efficientTest('margin 0'));
      assert.ok(efficientTest('margin 5px'));
      assert.ok(efficientTest('padding 0 5px'));
      assert.ok(efficientTest('padding 5px 0'));
      assert.ok(efficientTest('padding 5px 0 0'));
      assert.ok(efficientTest('padding: 0'));
      assert.ok(efficientTest('padding 5px'));
      assert.ok(efficientTest('padding: 1px 2px 3px 4px'));
    });

    it('undefined if nothing to test', () => {
      app.cache.line = 'border 0';
      assert.equal(undefined, efficientTest());
    });
  });

  describe('efficient: prefer margin 0 0 0 0 over margin 0', () => {
    const efficientTest = lint.efficient.bind(app);

    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if value is not efficient', () => {
      assert.equal(false, efficientTest('margin 0 0 0 0'));
      assert.equal(false, efficientTest('margin 0 0 0'));
      assert.equal(false, efficientTest('margin 0 0'));
      assert.equal(false, efficientTest('margin 0 5px 0 5px'));
      assert.equal(false, efficientTest('margin 5px 0 5px'));
      assert.equal(false, efficientTest('margin 5px 0 5px 0'));
      assert.equal(false, efficientTest('margin 0 5px 0'));
      assert.equal(false, efficientTest('margin 0 5px 5px 5px'));
      assert.equal(false, efficientTest('padding 0 0 0 0'));
      assert.equal(false, efficientTest('padding 0 0 0'));
      assert.equal(false, efficientTest('padding 0 0'));
      assert.equal(false, efficientTest('padding 0 5px 0 5px'));
      assert.equal(false, efficientTest('padding 5px 0 5px'));
      assert.equal(false, efficientTest('padding 5px 0 5px 0'));
      assert.equal(false, efficientTest('padding 0 5px 0'));
      assert.equal(false, efficientTest('padding 0 5px 5px 5px'));
    });

    it('true if value is efficient', () => {
      assert.ok(efficientTest('margin 0 5px'));
      assert.ok(efficientTest('margin: 5px 0'));
      assert.ok(efficientTest('margin 5px 0 0'));
      assert.ok(efficientTest('margin 0'));
      assert.ok(efficientTest('margin 5px'));
      assert.ok(efficientTest('padding 0 5px'));
      assert.ok(efficientTest('padding 5px 0'));
      assert.ok(efficientTest('padding 5px 0 0'));
      assert.ok(efficientTest('padding: 0'));
      assert.ok(efficientTest('padding 5px'));
      assert.ok(efficientTest('padding: 1px 2px 3px 4px'));
    });

    it('undefined if nothing to test', () => {
      app.cache.line = 'border 0';
      assert.equal(undefined, efficientTest());
    });
  });

  describe('extends style: prefer @extends over @extend', () => {
    const extendTest = lint.extendPref.bind(app);

    beforeEach(() => {
      app.state.conf = '@extends';
    });

    it('false if value already matches preferred style', () => {
      assert.equal(false, extendTest('@extends $placeHolderconst'));
    });

    it('true if value doesnt match preferred style', () => {
      assert.ok(extendTest('@extend $placeHolderconst'));
    });

    it('undefined if no extend on line', () => {
      assert.equal(undefined, extendTest('$var = #fff'));
    });
  });

  describe('extends style: prefer @extend over @extends', () => {
    const extendTest = lint.extendPref.bind(app);

    beforeEach(() => {
      app.state.conf = '@extend';
    });

    it('false if value already matches preferred style', () => {
      assert.equal(false, extendTest('@extend $placeHolderconst'));
    });

    it('true if value doesnt match preferred style', () => {
      assert.ok(extendTest('@extends $placeHolderconst'));
    });

    it('undefined if no extend on line', () => {
      assert.equal(undefined, extendTest('$var = #fff'));
    });
  });

  describe('hash start', () => {
    const hashTest = app.hashOrCSSStart.bind(app);

    beforeEach(() => {
      app.state.hashOrCSS = false;
      app.state.testsEnabled = true;
    });

    it('false if hash start not found', () => {
      assert.equal(false, hashTest('$myconst ='));
      assert.equal(false, hashTest('myconst = @block'));
      assert.equal(false, hashTest('.mistakenUseOfBracket {'));
      assert.equal(false, hashTest('margin 0'));
    });

    it('true if = and { are found on the same line (hash start)', () => {
      assert.ok(hashTest('myHash = {'));
    });

    it('app.state.hashOrCSS should be true after hash start', () => {
      hashTest('myHash = {');
      assert.ok(app.state.hashOrCSS);
    });

    it('undefined if in a hash', () => {
      app.state.hashOrCSS = true;
      assert.equal(undefined, hashTest('myHash = {'));
    });
  });

  describe('hash end', () => {
    const hashTest = app.hashOrCSSEnd.bind(app);

    beforeEach(() => {
      app.state.hashOrCSS = true;
    });

    it('false if in hash and valid } found', () => {
      assert.equal(false, hashTest('}'));
    });

    it('true if hash end } not found', () => {
      assert.ok(hashTest('margin 0'));
      assert.ok(hashTest('myHash = {'));
    });

    it('after finding end of hash, hash state should equal false', () => {
      assert.equal(false, hashTest('}'));
      assert.equal(false, app.state.hashOrCSS);
    });

    it('undefined if not in a hash', () => {
      app.state.hashOrCSS = false;
      assert.equal(undefined, hashTest('margin 0'));
      assert.equal(undefined, hashTest('myHash = {'));
      assert.equal(undefined, hashTest('}'));
    });
  });

  describe('indent pref', () => {
    const indentTest = lint.indentPref.bind(app);

    beforeEach(() => {
      app.state.conf = 2;
    });

    it('false if line indented with incorrect # of spaces', () => {
      app.state.context = 1.5;
      assert.equal(false, indentTest('   .test'));
      app.state.context = 0.5;
      assert.equal(false, indentTest(' .test2'));
    });

    it('true if line indented with correct # of spaces', () => {
      app.state.context = 1;
      assert.ok(indentTest('  .test'));
      app.state.context = 2;
      assert.ok(indentTest('    .test2'));
    });
  });

  describe('keyframes end', () => {
    const keyframesEndTest = app.keyframesEnd.bind(app);

    it('false if keyframes active and context set to 0 (keyframes ended)', () => {
      app.state.keyframes = true;
      app.state.context = 0;
      assert.equal(false, keyframesEndTest('.newClass'));
    });

    it('true if line doesnt have a context of zero', () => {
      app.state.keyframes = true;
      app.state.context = 1;
      assert.ok(keyframesEndTest('    from {'));
    });

    it('undefined if NOT already in @keyframes', () => {
      app.state.keyframes = false;
      assert.equal(undefined, keyframesEndTest('margin 0'));
    });
  });

  describe('keyframes start', () => {
    const keyframesStartTest = app.keyframesStart.bind(app);

    afterEach(() => {
      app.state.keyframes = false;
    });

    it('true if line has @keyframes', () => {
      app.state.keyframes = false;
      assert.ok(keyframesStartTest('@keyframes {'));
    });

    it('true if line has vendor @keyframes', () => {
      app.state.keyframes = false;
      assert.ok(keyframesStartTest('@-webkit-keyframes {'));
    });

    it('false if line isnt a start of @keyframes', () => {
      app.state.keyframes = false;
      assert.equal(false, keyframesStartTest('margin 0'));
    });

    it('undefined if already in @keyframes', () => {
      app.state.keyframes = true;
      assert.equal(undefined, keyframesStartTest('margin 0'));
    });
  });

  describe('leading zero always: prefer 0.9 over .9', () => {
    const zeroTest = lint.leadingZero.bind(app);

    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('null if leading zero not found', () => {
      assert.equal(null, zeroTest('color (0, 0, 0, .18)'));
      assert.equal(null, zeroTest('color (0,0,0,.18)'));
      assert.equal(null, zeroTest('font-size .9em'));
      assert.equal(null, zeroTest('transform rotate( .33deg )'));
      assert.equal(null, zeroTest('transform rotate(.33deg)'));
    });

    it('true if line has a zero before a decimal point and not part of range', () => {
      assert.ok(zeroTest('color (0, 0, 0, 0.18)'));
      assert.ok(zeroTest('color (0,0,0,0.18)'));
      assert.ok(zeroTest('transform rotate(0.33deg)'));
      assert.ok(zeroTest('transform rotate( 0.33deg )'));
    });

    it('undefined if range', () => {
      assert.equal(undefined, zeroTest('for 0..9'));
      assert.equal(undefined, zeroTest('for 0...9'));
      assert.equal(undefined, zeroTest('for $ in (0..9)'));
    });

    it('undefined if leading num not zero', () => {
      assert.equal(undefined, zeroTest('font-size: 1.1em'));
      assert.equal(undefined, zeroTest('transform rotate( 22.33deg )'));
      assert.equal(undefined, zeroTest('width 33.3333333%'));
    });

    // eslint-disable-next-line no-useless-escape
    it('undefined if no .\d in line', () => {
      assert.equal(undefined, zeroTest('margin auto'));
      assert.equal(undefined, zeroTest('.className'));
      assert.equal(undefined, zeroTest('.class.other-class'));
    });
  });

  describe('leading zero never: prefer .9 or 0.9', () => {
    const zeroTest = lint.leadingZero.bind(app);

    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('null if leading zero not found', () => {
      assert.equal(null, zeroTest('color (0, 0, 0, .18)'));
      assert.equal(null, zeroTest('color (0,0,0,.18)'));
      assert.equal(null, zeroTest('font-size .9em'));
      assert.equal(null, zeroTest('transform rotate( .33deg )'));
      assert.equal(null, zeroTest('transform rotate(.33deg)'));
    });

    it('false if range', () => {
      assert.equal(undefined, zeroTest('for 0..9'));
      assert.equal(undefined, zeroTest('for 0...9'));
      assert.equal(undefined, zeroTest('for $ in (0..9)'));
    });

    it('true if line has a zero before a decimal point and', () => {
      assert.ok(zeroTest('color (0, 0, 0, 0.18)'));
      assert.ok(zeroTest('color (0,0,0,0.18)'));
      assert.ok(zeroTest('transform rotate(0.33deg)'));
      assert.ok(zeroTest('transform rotate( 0.33deg )'));
    });

    it('undefined if leading num not zero', () => {
      assert.equal(undefined, zeroTest('font-size: 1.1em'));
      assert.equal(undefined, zeroTest('transform rotate( 22.33deg )'));
      assert.equal(undefined, zeroTest('width 33.3333333%'));
    });

    it('undefined if no . in line', () => {
      assert.equal(undefined, zeroTest('margin auto'));
    });
  });

  /* eslint-disable no-tabs */
  describe('mixed spaces and tabs', () => {
    const mixed = lint.mixed.bind(app);

    it('false if no mixed spaces and tabs found: spaces preferred', () => {
      app.config.indentPref = 4;
      assert.equal(false, mixed('', '    margin 0'));
    });

    it('false if no mixed spaces and tabs found: tabs preferred', () => {
      app.config.indentPref = 'tabs';
      assert.equal(false, mixed('', '	margin 0'));
    });

    it('true if spaces and tabs are mixed: spaces preferred', () => {
      app.config.indentPref = 4;
      assert.ok(mixed('', '  	margin 0'));
      assert.ok(mixed('', '	 padding 0em'));
    });

    it('true if spaces and tabs are mixed: tabs preferred', () => {
      app.config.indentPref = 'tabs';
      assert.ok(mixed('', '      margin 0'));
    });
  });
  /* eslint-enable */

  describe('naming convention', () => {
    const conventionTest = lint.namingConvention.bind(app);

    beforeEach(() => {
      app.config.namingConventionStrict = true;
    });

    afterEach(() => {
      app.config.namingConventionStrict = false;
    });

    it('false if correct naming convention: lowercase-dash', () => {
      app.state.conf = 'lowercase-dash';

      assert.equal(false, conventionTest('$var-name-like-this ='));
      assert.equal(false, conventionTest('.class-name-like-this'));
      assert.equal(false, conventionTest('#id-name-like-this'));
      assert.equal(false, conventionTest('.block-{$class-name}'));
      assert.equal(false, conventionTest('#{$class-name}'));
      assert.equal(false, conventionTest('#block-{$class-name}'));
      assert.equal(false, conventionTest(':{$const-name}'));
      assert.equal(false, conventionTest('$constname'));
      assert.equal(false, conventionTest('$constname = "Font Name"'));
    });

    it('false if correct naming convention: lowercase_underscore', () => {
      app.state.conf = 'lowercase_underscore';

      assert.equal(false, conventionTest('$const_name_like_this ='));
      assert.equal(false, conventionTest('.class_name_like_this'));
      assert.equal(false, conventionTest('#id_name_like_this'));
      assert.equal(false, conventionTest('.block_{$const_name}'));
      assert.equal(false, conventionTest('#{$const_name}'));
      assert.equal(false, conventionTest('#block_{$const_name}'));
      assert.equal(false, conventionTest(':{$const_name}'));
      assert.equal(false, conventionTest('$constname'));
      assert.equal(false, conventionTest('$constname = "Font Name"'));
    });

    it('false if correct naming convention: camelCase', () => {
      app.state.conf = 'camelCase';

      assert.equal(false, conventionTest('$varNameLikeThis ='));
      assert.equal(false, conventionTest('.classNameLikeThis'));
      assert.equal(false, conventionTest('#idNameLikeThis'));
      assert.equal(false, conventionTest('.block{$varName}'));
      assert.equal(false, conventionTest('#{$varName}'));
      assert.equal(false, conventionTest('#block{$varName}'));
      assert.equal(false, conventionTest(':{$varName}'));
      assert.equal(false, conventionTest('$varname'));
      assert.equal(false, conventionTest('$varname = "Font-name"'));
    });

    it('false if correct naming convention: BEM', () => {
      app.state.conf = 'BEM';

      assert.equal(false, conventionTest('$var-name__like-this ='));
      assert.equal(false, conventionTest('.class-name__like-this'));
      assert.equal(false, conventionTest('#id-name__like-this'));
      assert.equal(false, conventionTest('.block-{$var__name}'));
      assert.equal(false, conventionTest('#{$var__name}'));
      assert.equal(false, conventionTest(':{$var__name}'));
      assert.equal(false, conventionTest('#block__{$var-name}'));
      assert.equal(false, conventionTest('#block{$var-name}'));
      assert.equal(false, conventionTest('$varname'));
      assert.equal(false, conventionTest('$varname = "Font Name"'));
    });

    it('true if NOT correct naming convention: lowercase-dash', () => {
      app.state.conf = 'lowercase-dash';

      assert.ok(conventionTest('$var_name_like_this ='));
      assert.ok(conventionTest('.class_name_like_this'));
      assert.ok(conventionTest('#id_name_like_this'));
      assert.ok(conventionTest('.block_{$var-name}'));
      assert.ok(conventionTest('#{$var_name}'));
      assert.ok(conventionTest('#block_{$var_name}'));
      assert.ok(conventionTest(':{$var_name}'));
      assert.ok(conventionTest('.block_{$var-name}'));
    });

    it('true if NOT correct naming convention: lowercase_underscore', () => {
      app.state.conf = 'lowercase_underscore';

      assert.ok(conventionTest('$const-name-like-this ='));
      assert.ok(conventionTest('.class-name-like-this'));
      assert.ok(conventionTest('#id-name-like-this'));
      assert.ok(conventionTest('.block-{$const-name}'));
      assert.ok(conventionTest('#{$const-name}'));
      assert.ok(conventionTest('#block-{$const-name}'));
      assert.ok(conventionTest(':{$const-name}'));
      assert.ok(conventionTest('.block-{$constName}'));
      assert.ok(conventionTest('#{$constName}'));
      assert.ok(conventionTest('#block-{$constName}'));
      assert.ok(conventionTest(':{$constName}'));
      assert.ok(conventionTest('.block_{$const-name}'));
    });

    it('true if NOT correct naming convention: camelCase', () => {
      app.state.conf = 'camelCase';

      assert.ok(conventionTest('$const-name-like-this ='));
      assert.ok(conventionTest('.class-name-like-this'));
      assert.ok(conventionTest('#id-name-like-this'));
      assert.ok(conventionTest('$const_name_like_this ='));
      assert.ok(conventionTest('.class_name_like_this'));
      assert.ok(conventionTest('#id_name_like_this'));
      assert.ok(conventionTest('.block{$const-name}'));
      assert.ok(conventionTest('#{$const-name}'));
      assert.ok(conventionTest('#block{$const-name}'));
      assert.ok(conventionTest(':{$const-name}'));
      assert.ok(conventionTest('.block{$const_name}'));
      assert.ok(conventionTest('.block{$const-name}'));
      assert.ok(conventionTest('#{$const_name}'));
      assert.ok(conventionTest(':{$const_name}'));
      assert.ok(conventionTest('.block_{$const-name}'));
    });

    it('true if not correct naming convention: BEM', () => {
      app.state.conf = 'BEM';

      assert.ok(conventionTest('.classNameLikeThis'));
      assert.ok(conventionTest('#id_name_like_this'));
      assert.ok(conventionTest('.block_{$constName}'));
      assert.ok(conventionTest('#{$constName}'));
      assert.ok(conventionTest('#block_{$const-name}'));
      assert.ok(conventionTest('.block_{$const-name}'));
    });
  });

  describe('naming convention: strict turned off: ', () => {
    const conventionTest = lint.namingConvention.bind(app);

    beforeEach(() => {
      app.config.namingConventionStrict = false;
    });

    it('false if using classes or ids', () => {
      assert.equal(false, conventionTest('.class_name_like_this'));
      assert.equal(false, conventionTest('#id_name_like_this'));
      assert.equal(false, conventionTest('.class-name-like-this'));
      assert.equal(false, conventionTest('#id-name-like-this'));
      assert.equal(false, conventionTest('.class-name-like-this'));
      assert.equal(false, conventionTest('#id-name-like-this'));
    });

    it('false if custom convention matches', () => {
      app.state.conf = '[$]varExample';
      assert.equal(false, conventionTest('$varExample'));
    });

    it('true if custom convention doesnt match', () => {
      app.state.conf = 'somethin';
      assert.equal(true, conventionTest('$var_name_like_this'));
    });
  });

  describe('noImportant: disallow !important', () => {
    const importantTest = lint.noImportant.bind(app);

    before(() => {
      app.state.conf = true;
    });

    it('false if a line doesnt have !important', () => {
      assert.equal(false, importantTest('.foo'));
    });

    it('true if line has an !important', () => {
      assert.ok(importantTest('margin 5px !important'));
    });
  });

  describe('bannedFunctions: ban use of specific key words', () => {
    const bannedFunctions = lint.bannedFunctions.bind(app);

    before(() => {
      app.state.conf = true;
    });

    it('false if a line doesnt have any banned functions', () => {
      assert.equal(false, bannedFunctions('.foo'));
    });

    it('false if a line has banned functions but is not found', () => {
      app.config.bannedFunctions = ['translate3d'];
      assert.equal(false, bannedFunctions('.foo'));
    });

    it('true if line has a banned function', () => {
      app.config.bannedFunctions = ['translate3d'];
      assert.ok(bannedFunctions('translate3d(1px, 1px, 0px)'));
    });
  });

  describe('none: prefer 0 over none', () => {
    const noneTest = lint.none.bind(app);

    before(() => {
      app.state.conf = 'never';
    });

    // commenting out for now because the
    // state is getting stuck incorrectly here
    // so yeah @FIXME
    // running tests manually, they're passing

    // it( 'false (no err) if border 0', function() {
    //   assert.equal( false, noneTest( 'border 0' ) )
    //   assert.equal( false, noneTest( 'border: 0' ) )
    //   assert.equal( false, noneTest( 'border:0' ) )
    //   assert.equal( false, noneTest( 'border 1px solid red' ) )
    // } )

    // it( 'false (no err) if outline 0', function() {
    //   assert.equal( false, noneTest( 'outline 0' ) )
    //   assert.equal( false, noneTest( 'outline: 0' ) )
    //   assert.equal( false, noneTest( 'outline:0' ) )
    //   assert.equal( false, noneTest( 'outline 1px solid red' ) )
    // } )

    // it( 'true (err found) if border none', function() {
    //   assert.ok( noneTest( 'border none' ) )
    //   assert.ok( noneTest( 'border: none' ) )
    //   assert.ok( noneTest( 'border:none' ) )
    // } )

    // it( 'true (err found) if outline none', function() {
    //   assert.ok( noneTest( 'outline none' ) )
    //   assert.ok( noneTest( 'outline: none' ) )
    //   assert.ok( noneTest( 'outline:none' ) )
    // } )

    it('undefined if border or outline not on line', () => {
      assert.equal(undefined, noneTest('margin 0'));
      assert.equal(undefined, noneTest('padding inherit'));
    });
  });

  describe('none: prefer none over 0', () => {
    const noneTest = lint.none.bind(app);

    before(() => {
      app.state.conf = 'always';
    });

    it('false (no err) if border none', () => {
      assert.ok(!noneTest('border none'));
      assert.ok(!noneTest('border: none'));
      assert.ok(!noneTest('border:none'));
      assert.ok(!noneTest('border 1px solid red'));
    });

    it('false (no err) if outline none', () => {
      assert.ok(!noneTest('outline none'));
      assert.ok(!noneTest('outline: none'));
      assert.ok(!noneTest('outline:none'));
      assert.ok(!noneTest('outline 1px solid red'));
    });

    it('true (err) if border 0 or not applicable', () => {
      assert.ok(noneTest('border 0'));
      assert.ok(noneTest('border: 0'));
      assert.ok(noneTest('border:0'));
    });

    it('true (err) if outline 0 or not applicable', () => {
      assert.ok(noneTest('outline 0'));
      assert.ok(noneTest('outline: 0'));
      assert.ok(noneTest('outline:0'));
    });

    it('undefined if border or outline not on line', () => {
      assert.equal(undefined, noneTest('margin 0'));
      assert.equal(undefined, noneTest('padding inherit'));
    });
  });

  describe('parens: prefer ( param ) over (param)', () => {
    const parenTest = lint.parenSpace.bind(app);

    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('null if no extra space', () => {
      assert.equal(null, parenTest('', 'myMixin(param1, param2)'));
      assert.equal(null, parenTest('', 'myMixin( param1, param2)'));
      assert.equal(null, parenTest('', 'myMixin(param1, param2 )'));
    });

    it('true if has extra spaces', () => {
      assert.ok(parenTest('', 'myMixin( param1, param2 )'));
    });

    it('undefined if no parens on line', () => {
      assert.equal(undefined, parenTest('', '.notAMixin '));
    });
  });

  describe('parens: prefer (param) over ( param )', () => {
    const parenTest = lint.parenSpace.bind(app);

    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('null if no extra space', () => {
      assert.equal(null, parenTest('', 'myMixin(param1, param2)'));
      assert.equal(null, parenTest('', 'myMixin( param1, param2)'));
      assert.equal(null, parenTest('', 'myMixin(param1, param2 )'));
    });

    it('true if has extra spaces', () => {
      assert.ok(parenTest('', 'myMixin( param1, param2 )'));
    });

    it('undefined if no parens on line', () => {
      assert.equal(undefined, parenTest('', '.notAMixin '));
    });
  });

  describe('placeholders: prefer $var over .class when extending: ', () => {
    const placeholderTest = lint.placeholders.bind(app);

    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('false if placeholder var not used', () => {
      assert.equal(false, placeholderTest('@extend .notVar'));
      assert.equal(false, placeholderTest('@extends .notVar'));
    });

    it('false if @extend by itself', () => {
      assert.equal(false, placeholderTest('@extend$placeholderconst'));
      assert.equal(false, placeholderTest('@extends'));
    });

    it('true if placeholder var is used', () => {
      assert.ok(placeholderTest('@extends $placeholderconst'));
      assert.ok(placeholderTest('@extend $placeholderconst'));
    });

    it('undefined if no extend found', () => {
      assert.equal(undefined, placeholderTest('margin 0'));
    });
  });

  describe('placeholders: prefer $var over .class when extending: ', () => {
    const placeholderTest = lint.placeholders.bind(app);

    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if placeholder var not used', () => {
      assert.equal(false, placeholderTest('@extend .notVar'));
      assert.equal(false, placeholderTest('@extends .notVar'));
    });

    it('false if @extend by itself', () => {
      assert.equal(false, placeholderTest('@extend$placeholderconst'));
      assert.equal(false, placeholderTest('@extends'));
    });

    it('true if placeholder var is used', () => {
      assert.ok(placeholderTest('@extends $placeholderconst'));
      assert.ok(placeholderTest('@extend $placeholderconst'));
    });

    it('undefined if no extend found', () => {
      assert.equal(undefined, placeholderTest('margin 0'));
    });
  });

  describe('prefix var with $: always', () => {
    const varTest = lint.prefixVarsWithDollar.bind(app);

    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('false if $ is missing when declaring variable', () => {
      assert.equal(false, varTest('var = 0'));
    });

    it('true if $ is found and is correct', () => {
      assert.ok(varTest('$my-var = 0'));
      assert.ok(varTest('$first-value = floor( (100% / $columns) * $index )'));
      assert.ok(varTest('$-my-private-var = red'));
      assert.ok(varTest('$_myPrivateVar = red'));
    });

    it('undefined if @block var', () => {
      assert.equal(undefined, varTest('var = @block'));
    });
  });

  describe('prefix var with $: never', () => {
    const varTest = lint.prefixVarsWithDollar.bind(app);

    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if $ is missing', () => {
      assert.equal(false, varTest('var = 0'));
      assert.equal(false, varTest('transition( param, param )'));
    });

    it('true if $ is found anywhere on line', () => {
      assert.ok(varTest('margin $gutter'));
      assert.ok(varTest('transition $param $param'));
    });

    it('undefined if @block var', () => {
      assert.equal(undefined, varTest('var = @block'));
    });
  });

  describe('quote style', () => {
    const quoteTest = lint.quotePref.bind(app);

    it('false if correct quote style used: single', () => {
      app.state.conf = 'single';
      assert.equal(false, quoteTest('', "$var = 'test string' "));
      assert.equal(false, quoteTest('', "$var = 'test \"substring\" string' "));
      assert.equal(false, quoteTest('', ".show-content( $content = 'Hello!' )"));
      assert.equal(false, quoteTest('', ".show-content( $content = 'Hello!' ) {"));
      assert.equal(false, quoteTest('', '.join-strings( $content1 = \'Hello!\', $content2 = \'World!\' )'));
      assert.equal(false, quoteTest('', "[class*='--button']"));
      assert.equal(false, quoteTest('', "[class*='--button'] {"));
      assert.equal(false, quoteTest('', "show-content( $content = 'Hello!' ) {"));
    });

    it('false if correct quote style used: double', () => {
      app.state.conf = 'double';
      assert.equal(false, quoteTest('', "$var = 'test \"substring\" string' "));
      assert.equal(false, quoteTest('', "$var = 'test \"substring string' "));
      assert.equal(false, quoteTest('', '$var = "test \'substring\' string"'));
      assert.equal(false, quoteTest('', '$var = "test let\'s string"'));
      assert.equal(false, quoteTest('', '$var = "test string" '));
      assert.equal(false, quoteTest('', '$var = "test \'substring\' string"'));
      assert.equal(false, quoteTest('', '$var = "test let\'s string"'));
      assert.equal(false, quoteTest('', '.show-content( $content = "Hello!" )'));
      assert.equal(false, quoteTest('', '.show-content( $content = "Hello!" ) {'));
      assert.equal(false, quoteTest('', '.join-strings( $content1 = "Hello!", $content2 = "World!" )'));
      assert.equal(false, quoteTest('', '[class*="--button"]'));
      assert.equal(false, quoteTest('', '[class*="--button"] {'));
      assert.equal(false, quoteTest('', 'show-content( $content = "Hello!" ) {'));
    });

    it('true if incorrect quote style used: single', () => {
      app.state.conf = 'single';
      assert.ok(quoteTest('', '$var = "test string" '));
      assert.ok(quoteTest('', '.show-content( $content = "Hello!" )'));
      assert.ok(quoteTest('', '.join-strings( $content1 = "Hello!", $content2 = \'World!\' )'));
      assert.ok(quoteTest('', '.show-content( $content = "Hello!" ) {'));
      assert.ok(quoteTest('', '[class*="--button"]'));
    });

    it('true if incorrect quote style used: double', () => {
      app.state.conf = 'double';
      assert.ok(quoteTest('', "$var = 'test string' "));
      assert.ok(quoteTest('', ".show-content( $content = 'Hello!' )"));
      assert.ok(quoteTest('', ".show-content( $content = 'Hello!' ) {"));
      assert.ok(quoteTest('', '.join-strings( $content1 = "Hello!", $content2 = \'World!\' )'));
      assert.ok(quoteTest('', "[class*='--button']"));
    });

    it('undefined if no quotes on line', () => {
      assert.equal(undefined, quoteTest('', '$var = #000 '));
    });
  });

  describe('semicolon never (prefer margin 0 to margin 0;)', () => {
    const semiTest = lint.semicolons.bind(app);

    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('true if semicolon found', () => {
      assert.ok(semiTest('margin 0 auto;'));
    });

    it('undefined if no semicolon is found', () => {
      assert.equal(undefined, semiTest('margin 0 auto'));
      assert.equal(undefined, semiTest('    margin 0 auto'));
      assert.equal(undefined, semiTest('    .class-name'));
    });

    it('undefined if line skipped (syntax)', () => {
      assert.equal(undefined, semiTest('var ='));
      assert.equal(undefined, semiTest('var = @block'));
      assert.equal(undefined, semiTest('for ( 0..9 )'));
      assert.equal(undefined, semiTest('}'));
      assert.equal(undefined, semiTest('.class-name'));
      assert.equal(undefined, semiTest('if ( 1 > 0 )'));
      assert.equal(undefined, semiTest('&__anything'));
      assert.equal(undefined, semiTest('path,'));
    });
  });

  describe('semicolon always (prefer margin 0; to margin 0)', () => {
    const semiTest = lint.semicolons.bind(app);

    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('false if no semicolon is found', () => {
      app.state.context = 1;
      assert.equal(false, semiTest('margin 0 auto'));
    });

    it('undefined if semicolon is found', () => {
      assert.equal(undefined, semiTest('margin 0 auto;'));
    });

    it('undefined if line skipped (syntax)', () => {
      assert.equal(undefined, semiTest('var ='));
      assert.equal(undefined, semiTest('var = @block'));
      assert.equal(undefined, semiTest('for ( 0..9 )'));
      assert.equal(undefined, semiTest('}'));
      assert.equal(undefined, semiTest('.class-name'));
      assert.equal(undefined, semiTest('if ( 1 > 0 )'));
      assert.equal(undefined, semiTest('&__anything'));
      assert.equal(undefined, semiTest('path,'));
    });
  });

  describe('sort order', () => {
    const sortTest = lint.sortOrder.bind(app);

    beforeEach(() => {
      app.state.prevContext = 1;
      app.state.context = 1;
    });

    afterEach(() => {
      app.cache.sortOrderCache = [];
    });

    it('undefined if root level', () => {
      app.state.context = 0;
      assert.equal(undefined, sortTest('margin 0'));
    });

    it('cache length should only be 1 (the current prop) if context switched', () => {
      app.cache.sortOrderCache = ['border', 'margin', 'padding'];
      app.state.prevContext = 0;
      app.state.context = 1;

      assert.equal(3, app.cache.sortOrderCache.length);
      sortTest('margin 0');
      assert.equal(1, app.cache.sortOrderCache.length);
    });

    describe('disabled', () => {
      beforeEach(() => {
        app.state.conf = false;
      });

      it('should allow any order when disabled', () => {
        const expectedCache = ['background', 'z-index', 'border', 'width'];

        assert.equal(false, app.state.conf);
        assert.ok(sortTest('  background'));
        assert.ok(sortTest('  z-index'));
        assert.ok(sortTest('  border'));
        assert.ok(sortTest('  width'));
        assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
        assert.deepEqual(expectedCache, app.cache.sortOrderCache);
      });
    });

    describe('alphabetical', () => {
      beforeEach(() => {
        app.state.conf = 'alphabetical';
        app.cache.sortOrderCache = ['border', 'margin', 'padding'];
      });

      afterEach(() => {
        app.cache.sortOrderCache = [];
      });

      it('true if correct sort order with mocked sort order cache', () => {
        const expectedCache = ['border', 'margin', 'padding', 'position', 'z-index'];

        assert.equal('alphabetical', app.state.conf);
        assert.equal(3, app.cache.sortOrderCache.length);
        assert.ok(sortTest('  position absolute'));
        assert.ok(sortTest('  z-index 1'));
        assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
        assert.deepEqual(expectedCache, app.cache.sortOrderCache);
      });

      it('false if not correct sort order with mocked sort order cache', () => {
        const expectedCache = [
          'border',
          'margin',
          'padding',
          'line-height',
          'background',
          'border',
          'color',
        ];

        assert.equal('alphabetical', app.state.conf);
        assert.equal(3, app.cache.sortOrderCache.length);
        assert.equal(false, sortTest('  line-height 1'));
        assert.equal(false, sortTest('  background none'));
        assert.equal(false, sortTest('border 1px solid #fff'));
        assert.equal(false, sortTest('color: rgba( 0, 0, 0, 1 )'));
        assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
        assert.deepEqual(expectedCache, app.cache.sortOrderCache);
      });

      it('undefined if not checkable syntax', () => {
        assert.equal('alphabetical', app.state.conf);
        assert.equal(3, app.cache.sortOrderCache.length);
        assert.equal(undefined, sortTest('mixin()'));
        assert.equal(undefined, sortTest('$var-name'));
        assert.equal(undefined, sortTest('.class-name'));
        assert.equal(undefined, sortTest('#id'));
        assert.equal(undefined, sortTest('{interpolated}'));
      });
    });

    describe('grouped', () => {
      beforeEach(() => {
        app.state.conf = 'grouped';
        app.cache.sortOrderCache = ['position', 'right'];
      });

      afterEach(() => {
        app.cache.sortOrderCache = [];
      });

      it('false if sorted array is shorter than cache', () => {
        app.cache.sortOrderCache = ['border', 'margin', 'padding'];
        assert.equal(false, sortTest('margin 0'));
      });

      it('false if not correct sort order with mocked sort order cache', () => {
        const expectedCache = ['position', 'right', 'top'];

        assert.equal('grouped', app.state.conf);
        assert.equal(2, app.cache.sortOrderCache.length);
        assert.equal(false, sortTest('top 0'));
        assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
        assert.deepEqual(expectedCache, app.cache.sortOrderCache);
      });

      it('true if correct sort order with mocked sort order cache', () => {
        const expectedCache = ['position', 'right', 'bottom', 'z-index', 'width'];

        assert.equal('grouped', app.state.conf);
        assert.equal(2, app.cache.sortOrderCache.length);
        assert.ok(sortTest('bottom 0'));
        assert.ok(sortTest('z-index 1'));
        assert.ok(sortTest('width 50%'));
        assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
        assert.deepEqual(expectedCache, app.cache.sortOrderCache);
      });
    });

    describe('Array', () => {
      beforeEach(() => {
        app.state.conf = ['z-index', 'animation', 'top'];
        app.cache.sortOrderCache = ['z-index'];
      });

      afterEach(() => {
        app.cache.sortOrderCache = [];
      });

      it('false if not correct sort order with mocked sort order cache', () => {
        const expectedCache = ['z-index', 'top', 'animation'];

        assert.deepEqual(['z-index', 'animation', 'top'], app.state.conf);
        assert.equal(1, app.cache.sortOrderCache.length);
        assert.ok(sortTest('top 50px'));
        assert.equal(false, sortTest('animation fade-out'));
        assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
        assert.deepEqual(expectedCache, app.cache.sortOrderCache);
      });

      it('true if correct sort order with mocked sort order cache', () => {
        const expectedCache = ['z-index', 'animation', 'top', 'width', 'border'];

        assert.deepEqual(['z-index', 'animation', 'top'], app.state.conf);
        assert.equal(1, app.cache.sortOrderCache.length);
        assert.ok(sortTest('animation fade-in'));
        assert.ok(sortTest('top 0'));
        assert.ok(sortTest('width 50%'));
        assert.ok(sortTest('border 0'));
        assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
        assert.deepEqual(expectedCache, app.cache.sortOrderCache);
      });
    });
  });

  describe('stacked properties', () => {
    const stackedTest = lint.stackedProperties.bind(app);

    it('false if not a one liner', () => {
      assert.equal(false, stackedTest('margin 0 auto'));
    });

    it('true if one liner', () => {
      assert.ok(stackedTest('margin 0 auto; padding: 5px;'));
      assert.ok(stackedTest('margin 0 auto; padding: 5px'));
    });
  });

  describe('starts with comment', () => {
    const startsWithComment = app.startsWithComment.bind(app);

    it('false if // not first char on line', () => {
      assert.equal(false, startsWithComment('margin 0 auto //test'));
    });

    it('true if // is the first character on the line', () => {
      assert.ok(startsWithComment('//test'));
      assert.ok(startsWithComment(' // test'));
    });
  });

  describe('stylint off toggle:', () => {
    const toggleTest = app.stylintOff.bind(app);

    it('false if tests enabled and toggle found', () => {
      app.state.testsEnabled = true;
      assert.equal(false, toggleTest('@stylint off'));
    });

    it('true if tests enabled and toggle not found', () => {
      app.state.testsEnabled = true;
      assert.ok(toggleTest('margin 0 auto'));
    });

    it('undefined if tests already disabled', () => {
      app.state.testsEnabled = false;
      assert.equal(undefined, toggleTest('@stylint on'));
    });
  });

  describe('stylint on toggle:', () => {
    const toggleTest = app.stylintOn.bind(app);

    it('false if tests disabled and toggle not found', () => {
      app.state.testsEnabled = false;
      assert.equal(false, toggleTest('margin 0 auto'));
    });

    it('true if tests disabled and toggle found', () => {
      app.state.testsEnabled = false;
      assert.ok(toggleTest('@stylint on'));
    });

    it('undefined if tests already enabled', () => {
      app.state.testsEnabled = true;
      assert.equal(undefined, toggleTest('@stylint on'));
    });
  });

  describe('trailing whitespace', () => {
    const whitespaceTest = lint.trailingWhitespace.bind(app);

    it('false if no trailing whitespace', () => {
      assert.equal(false, whitespaceTest('', 'margin 0 auto'));
    });

    it('true if whitespace found', () => {
      assert.ok(whitespaceTest('', 'margin 0 auto  '));
      assert.ok(whitespaceTest('', 'margin 0 auto '));
    });
  });

  describe('universal selector', () => {
    const universalTest = lint.universal.bind(app);

    it('false if no invalid * is found', () => {
      assert.equal(false, universalTest('return ( $width*$height )'));
      assert.equal(false, universalTest('content: "*"'));
    });

    it('true if * is found', () => {
      assert.ok(universalTest('*'));
      assert.ok(universalTest('*:before'));
      assert.ok(universalTest('*::after'));
    });

    it('undefined if no * on line', () => {
      assert.equal(undefined, universalTest('img'));
    });
  });

  describe('valid property:', () => {
    const validTest = lint.valid.bind(app);

    beforeEach(() => {
      app.state.keyframes = false;
    });

    it('true if from or to used INSIDE keyframes', () => {
      app.state.keyframes = true;
      assert.ok(validTest('from 0%'));
      assert.ok(validTest('to 100%'));
    });

    it('false if property not valid', () => {
      app.cache.mixins = [];
      assert.equal(false, validTest('marg 0 auto'));
      assert.equal(false, validTest('pad 0'));
      assert.equal(false, validTest('dog: irish-setter }'));
      assert.equal(false, validTest('{const name}'));
      assert.equal(false, validTest('div[attribute test]'));
      assert.equal(false, validTest('::selects'));
      assert.equal(false, validTest('nonsense:active'));
      assert.equal(false, validTest('test-mixin: $val'));
      assert.equal(false, validTest('mixin 5px'));
      assert.equal(false, validTest('multiplyBy5 10 5'));
      assert.equal(false, validTest('test-mixin $val'));
    });

    it('true if property is valid', () => {
      assert.ok(validTest('background'));
      assert.ok(validTest('border-bottom 0'));
      assert.ok(validTest('margin-top 0'));
      assert.ok(validTest('padding 0'));
      assert.ok(validTest('-webkit-border-radius 0'));
      assert.ok(validTest('input'));
      assert.ok(validTest('body'));
      assert.ok(validTest('::selection'));
      assert.ok(validTest('div:hover'));
      assert.ok(validTest('button:active'));
      assert.ok(validTest('p:optional'));
      assert.ok(validTest('p.classname'));
      assert.ok(validTest('div[attribute]'));
      assert.ok(validTest('picture'));
      assert.ok(validTest('source'));
      assert.ok(validTest('src: "url/to/font"'));
      assert.ok(validTest('background linear-gradient(to top, grey 50%, transparent 50%)'));
      assert.ok(validTest('img.attachment-event_thumb_single'));
      assert.ok(validTest('a.b-logo'));
    });

    it('true if syntax, class, id, interpolation, attribute, mixin etc', () => {
      assert.ok(validTest('.el:hover'));
      assert.ok(validTest('$const-name = '));
      assert.ok(validTest('{const-name}'));
      assert.ok(validTest('my-hash = {'));
      assert.ok(validTest('for i in 0..9'));
      assert.ok(validTest('&--append-class-name'));
      assert.ok(validTest('[data-js]'));
      assert.ok(validTest('#id:hover'));
      assert.ok(validTest('transition( opacity )'));
      assert.ok(validTest('return $val'));
      assert.ok(validTest('width calc(100% - 16px)'));
    });

    it('true if transparent mixin (thats been declared)', () => {
      app.cache.customProperties = ['test-mixin', 'mixin', 'multiplyBy'];

      assert.ok(validTest('test-mixin: $val'));
      assert.ok(validTest('mixin 5px'));
      assert.ok(validTest('multiplyBy 10 5'));
      assert.ok(validTest('test-mixin $val'));
    });

    it('undefined if from or to used outside keyframes', () => {
      assert.equal(undefined, validTest('from 0%'));
      assert.equal(undefined, validTest('to 100%'));
    });

    it('true if pseudo is standalone and valid', () => {
      assert.ok(validTest('::-webkit-resizer'));
      assert.ok(validTest('::-webkit-scrollbar'));
      assert.ok(validTest('::-moz-inner-focus'));
      assert.ok(validTest(':focus'));
      assert.ok(validTest('::placeholder'));
    });

    it('false if pseudo is standalone and not valid', () => {
      assert.equal(false, validTest('::-any-thing'));
      assert.equal(false, validTest(':focush'));
    });
  });

  describe('zero units: prefer no unit values', () => {
    const zeroTest = lint.zeroUnits.bind(app);

    beforeEach(() => {
      app.state.keyframes = false;
      app.state.conf = 'never';
    });

    it('true if value above 0', () => {
      assert.ok(zeroTest('margin 50px'));
      assert.ok(zeroTest('margin: 100%'));
    });

    it('true if just 0 has no unit value', () => {
      assert.ok(zeroTest('margin 0'));
    });

    // eslint-disable-next-line no-useless-escape
    it('true if \d0 + any unit type is found', () => {
      assert.equal(false, zeroTest('margin 0px'));
      assert.equal(false, zeroTest('margin 0em'));
      assert.equal(false, zeroTest('margin 0rem'));
      assert.equal(false, zeroTest('margin 0pt'));
      assert.equal(false, zeroTest('margin 0pc'));
      assert.equal(false, zeroTest('margin 0vh'));
      assert.equal(false, zeroTest('margin 0vw'));
      assert.equal(false, zeroTest('margin 0vmin'));
      assert.equal(false, zeroTest('margin 0vmax'));
      assert.equal(false, zeroTest('margin 0mm'));
      assert.equal(false, zeroTest('margin 0cm'));
      assert.equal(false, zeroTest('margin 0in'));
      assert.equal(false, zeroTest('margin 0mozmm'));
      assert.equal(false, zeroTest('margin 0ex'));
      assert.equal(false, zeroTest('margin 0ch'));
    });

    it('undefined if in keyframes', () => {
      app.state.keyframes = true;
      assert.equal(undefined, zeroTest('from 0%'));
      assert.equal(undefined, zeroTest('0% {'));
      app.state.keyframes = false;
    });

    it('undefined if no 0 on line', () => {
      assert.equal(undefined, zeroTest('margin auto'));
      assert.equal(undefined, zeroTest('padding 53px'));
    });

    it('undefined if relative value', () => {
      assert.equal(undefined, zeroTest('line-height 1'));
      assert.equal(undefined, zeroTest('font-weight 600'));
    });
  });

  describe('zero units: prefer unit values', () => {
    const zeroTest = lint.zeroUnits.bind(app);

    beforeEach(() => {
      app.state.keyframes = false;
      app.state.conf = 'always';
    });

    it('false if 0 value does not have unit values', () => {
      assert.equal(false, zeroTest('margin 0'));
    });

    it('true if value is above 0 (like 50px)', () => {
      assert.ok(zeroTest('margin 50px'));
      assert.ok(zeroTest('margin: 100%'));
    });

    it('true if 0 + any unit type is found', () => {
      assert.ok(zeroTest('margin 0px'));
      assert.ok(zeroTest('margin 0em'));
      assert.ok(zeroTest('margin 0rem'));
      assert.ok(zeroTest('margin 0pt'));
      assert.ok(zeroTest('margin 0pc'));
      assert.ok(zeroTest('margin 0vh'));
      assert.ok(zeroTest('margin 0vw'));
      assert.ok(zeroTest('margin 0vmin'));
      assert.ok(zeroTest('margin 0vmax'));
      assert.ok(zeroTest('margin 0mm'));
      assert.ok(zeroTest('margin 0cm'));
      assert.ok(zeroTest('margin 0in'));
      assert.ok(zeroTest('margin 0mozmm'));
      assert.ok(zeroTest('margin 0ex'));
      assert.ok(zeroTest('margin 0ch'));
    });

    it('undefined if in keyframes', () => {
      app.state.keyframes = true;
      assert.equal(undefined, zeroTest('from 0%'));
      assert.equal(undefined, zeroTest('0% {'));
      app.state.keyframes = false;
    });

    it('undefined if no 0 on line', () => {
      assert.equal(undefined, zeroTest('margin auto'));
      assert.equal(undefined, zeroTest('padding 53px'));
    });

    it('undefined if relative value', () => {
      assert.equal(undefined, zeroTest('line-height 1'));
      assert.equal(undefined, zeroTest('font-weight 600'));
    });
  });

  describe('zIndex Normalizer', () => {
    const zNormalizrTest = lint.zIndexNormalize.bind(app);

    beforeEach(() => {
      app.state.conf = 5;
    });

    it('false if z index value already normalized', () => {
      assert.equal(false, zNormalizrTest('z-index 5'));
    });

    it('false if no z-index', () => {
      assert.equal(false, zNormalizrTest('margin 5px'));
    });

    it('true if z index value needs to be normalized', () => {
      assert.ok(zNormalizrTest('z-index 4'));
    });

    it('undefined if 0 or -1', () => {
      assert.equal(undefined, zNormalizrTest('z-index -1'));
      assert.equal(undefined, zNormalizrTest('z-index 0'));
    });
  });
});

describe('Done, again: ', () => {
  beforeEach(() => {
    app.state.quiet = true;
    app.state.watching = true;
    app.cache.report = { results: [], errorCount: 0, warningCount: 0 };
    app.state.exitCode = 0;
  });

  it('should return an object', () => {
    assert.ok(typeof app.done() === 'object');
  });

  it('which should have msg as a property', () => {
    assert.ok(typeof app.done().msg === 'string');
  });

  it('exit code should be 0 if no errs', () => {
    assert.equal(0, app.done().exitCode);
  });

  it('exit code should be 0 if has warnings and no errs', () => {
    app.cache.report.warningCount = 1;
    assert.equal(0, app.done().exitCode);
  });

  it('msg should be empty if no errs or warnings', () => {
    assert.equal('', app.done().msg);
  });

  it('exit code of 1 if not clear', () => {
    app.cache.report.errorCount = 1;
    assert.equal(1, app.done().exitCode);
  });

  it('exit code should be 1 if over max warnings', () => {
    app.config.maxWarnings = 0;
    app.config.maxErrors = 10;
    app.cache.report.warningCount = 1;

    assert.equal(1, app.done().exitCode);
  });

  // it( 'should exit if watch off', function() {
  //   app.state.watching = false
  //   sinon.spy( app, 'done' )
  //   app.done()

  //   app.done.getCall(0).returned( sinon.match.same( process.exit ) )
  //   app.state.watching = true
  // } )
});

describe('Lint Text: ', () => {
  let linter;

  beforeEach(() => {
    linter = stylint.api();
  });

  it('should return object with violations', () => {
    const lintResult = linter.lintString('.class {\n  color: red !important\n}\n', null, 'filename.styl');

    assert.deepEqual(lintResult, {
      results: [{
        filePath: 'filename.styl',
        messages: [{
          column: 13,
          line: 2,
          message: '!important is disallowed',
          source: '  color: red !important',
          ruleId: 'noImportant',
          severity: 'warning',
        }, {
          column: 23,
          line: 2,
          message: 'missing semicolon',
          source: '  color: red !important',
          ruleId: 'semicolons',
          severity: 'warning',
        }],
        errorCount: 0,
        warningCount: 2,
      }],
      errorCount: 0,
      warningCount: 2,
    });
  });
});
