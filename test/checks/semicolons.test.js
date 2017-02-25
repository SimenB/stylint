'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.strictMode = true;
app.state.quiet = true;
app.state.watching = true;

const semiTest = app.lintMethods.semicolons.bind(app);

describe('semicolon', () => {
  beforeEach(() => {
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  describe('never (prefer margin 0 to margin 0;)', () => {
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

  describe('always (prefer margin 0; to margin 0)', () => {
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
});
