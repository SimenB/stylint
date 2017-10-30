'use strict';

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
      expect(varTest('var = 0')).toEqual(false);
    });

    it('true if $ is found and is correct', () => {
      expect(varTest('$my-var = 0')).toBeDefined();
      expect(
        varTest('$first-value = floor( (100% / $columns) * $index )')
      ).toBeDefined();
      expect(varTest('$-my-private-var = red')).toBeDefined();
      expect(varTest('$_myPrivateVar = red')).toBeDefined();
    });

    it('undefined if @block var', () => {
      expect(varTest('var = @block')).toBeUndefined();
    });
  });

  describe('var with $: never', () => {
    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if $ is missing', () => {
      expect(varTest('var = 0')).toEqual(false);
      expect(varTest('transition( param, param )')).toEqual(false);
    });

    it('true if $ is found anywhere on line', () => {
      expect(varTest('margin $gutter')).toBeDefined();
      expect(varTest('transition $param $param')).toBeDefined();
    });

    it('undefined if @block var', () => {
      expect(varTest('var = @block')).toBeUndefined();
    });
  });
});
