'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;
app.state.strictMode = true;

const parenTest = app.lintMethods.parenSpace.bind(app);

describe('parens', () => {
  beforeEach(() => {
    app.state.conf = 'always';
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  describe('prefer ( param ) over (param)', () => {
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

  describe('prefer (param) over ( param )', () => {
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
});
