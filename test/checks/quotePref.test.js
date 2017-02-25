'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.strictMode = true;
app.state.quiet = true;
app.state.watching = true;

const quoteTest = app.lintMethods.quotePref.bind(app);

describe('quote style', () => {
  beforeEach(() => {
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

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
