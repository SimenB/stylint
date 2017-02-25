'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const commaTest = app.lintMethods.commaSpace.bind(app);

describe('comma space', () => {
  afterEach(() => {
    app.cache.messages = [];
  });

  describe('prefer space after commas', () => {
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

  describe('prefer NO space after commas', () => {
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
});
