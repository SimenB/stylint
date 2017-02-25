'use strict';

const assert = require('assert');
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

  describe('never: prefer .9 or 0.9', () => {
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
});
