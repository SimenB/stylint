'use strict';

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
      expect(commaTest('', '0, 0, 0, .18')).toEqual(false);
      expect(commaTest('', '0,0, 0, .18')).toEqual(false);
      expect(commaTest('', 'content: ","')).toEqual(false);
    });

    it('true if no space after commas', () => {
      expect(commaTest('', '0,0,0,.18')).toBeDefined();
      expect(commaTest('', 'mixin( $param1,$param2 )')).toBeDefined();
    });

    it('undefined if no comma on line', () => {
      expect(commaTest('', 'margin 0')).toBeUndefined();
    });

    it('undefined if comma is last character', () => {
      expect(commaTest('', '.class,')).toBeUndefined();
    });
  });

  describe('prefer NO space after commas', () => {
    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if space after comma', () => {
      expect(commaTest('', '0, 0, 0, .18')).toEqual(false);
      expect(commaTest('', '0,0, 0, .18')).toEqual(false);
    });

    it('true if no space after commas', () => {
      expect(commaTest('', '0,0,0,.18')).toBeDefined();
      expect(commaTest('', 'mixin( $param1,$param2 )')).toBeDefined();
    });

    it('undefined if no comma on line', () => {
      expect(commaTest('', 'margin 0')).toBeUndefined();
    });

    it('undefined if comma is last character', () => {
      expect(commaTest('', '.class,')).toBeUndefined();
    });
  });
});
