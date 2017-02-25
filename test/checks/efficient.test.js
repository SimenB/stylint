'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const efficientTest = app.lintMethods.efficient.bind(app);

describe('efficient', () => {
  beforeEach(() => {
    app.state.conf = 'always';
    app.state.hashOrCSS = false;
    app.state.openBracket = false;
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  describe('prefer margin 0 over margin 0 0 0 0', () => {
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

  describe('prefer margin 0 0 0 0 over margin 0', () => {
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
});
