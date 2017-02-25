'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;
app.state.strictMode = true;

const varTest = app.lintMethods.prefixVarsWithDollar.bind(app);

describe('prefix', () => {
  beforeEach(() => {
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  describe('var with $: always', () => {
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

  describe('var with $: never', () => {
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
});
