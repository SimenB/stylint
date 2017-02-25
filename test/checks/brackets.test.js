'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const bracketsTest = app.lintMethods.brackets.bind(app);

describe('brackets', () => {
  beforeEach(() => {
    app.state.conf = 'always';
    app.state.hashOrCSS = false;
    app.state.openBracket = false;
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  describe('always use brackets', () => {
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

  describe('disallow brackets', () => {
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
});
