'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const zeroTest = app.lintMethods.leadingZero.bind(app);

describe('leading zero', () => {
  afterEach(() => {
    app.cache.messages = [];
  });

  describe('always: prefer 0.9 over .9', () => {
    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('null if leading zero not found', () => {
      expect(zeroTest('color (0, 0, 0, .18)')).toBeNull();
      expect(zeroTest('color (0,0,0,.18)')).toBeNull();
      expect(zeroTest('font-size .9em')).toBeNull();
      expect(zeroTest('transform rotate( .33deg )')).toBeNull();
      expect(zeroTest('transform rotate(.33deg)')).toBeNull();
    });

    it('true if line has a zero before a decimal point and not part of range', () => {
      expect(zeroTest('color (0, 0, 0, 0.18)')).toBeDefined();
      expect(zeroTest('color (0,0,0,0.18)')).toBeDefined();
      expect(zeroTest('transform rotate(0.33deg)')).toBeDefined();
      expect(zeroTest('transform rotate( 0.33deg )')).toBeDefined();
    });

    it('undefined if range', () => {
      expect(zeroTest('for 0..9')).toBeUndefined();
      expect(zeroTest('for 0...9')).toBeUndefined();
      expect(zeroTest('for $ in (0..9)')).toBeUndefined();
    });

    it('undefined if leading num not zero', () => {
      expect(zeroTest('font-size: 1.1em')).toBeUndefined();
      expect(zeroTest('transform rotate( 22.33deg )')).toBeUndefined();
      expect(zeroTest('width 33.3333333%')).toBeUndefined();
    });

    // eslint-disable-next-line no-useless-escape
    it('undefined if no .\d in line', () => {
      expect(zeroTest('margin auto')).toBeUndefined();
      expect(zeroTest('.className')).toBeUndefined();
      expect(zeroTest('.class.other-class')).toBeUndefined();
    });
  });

  describe('never: prefer .9 or 0.9', () => {
    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('null if leading zero not found', () => {
      expect(zeroTest('color (0, 0, 0, .18)')).toBeNull();
      expect(zeroTest('color (0,0,0,.18)')).toBeNull();
      expect(zeroTest('font-size .9em')).toBeNull();
      expect(zeroTest('transform rotate( .33deg )')).toBeNull();
      expect(zeroTest('transform rotate(.33deg)')).toBeNull();
    });

    it('false if range', () => {
      expect(zeroTest('for 0..9')).toBeUndefined();
      expect(zeroTest('for 0...9')).toBeUndefined();
      expect(zeroTest('for $ in (0..9)')).toBeUndefined();
    });

    it('true if line has a zero before a decimal point and', () => {
      expect(zeroTest('color (0, 0, 0, 0.18)')).toBeDefined();
      expect(zeroTest('color (0,0,0,0.18)')).toBeDefined();
      expect(zeroTest('transform rotate(0.33deg)')).toBeDefined();
      expect(zeroTest('transform rotate( 0.33deg )')).toBeDefined();
    });

    it('undefined if leading num not zero', () => {
      expect(zeroTest('font-size: 1.1em')).toBeUndefined();
      expect(zeroTest('transform rotate( 22.33deg )')).toBeUndefined();
      expect(zeroTest('width 33.3333333%')).toBeUndefined();
    });

    it('undefined if no . in line', () => {
      expect(zeroTest('margin auto')).toBeUndefined();
    });
  });
});
