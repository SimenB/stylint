'use strict';

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
      expect(parenTest('', 'myMixin(param1, param2)')).toBeNull();
      expect(parenTest('', 'myMixin( param1, param2)')).toBeNull();
      expect(parenTest('', 'myMixin(param1, param2 )')).toBeNull();
    });

    it('true if has extra spaces', () => {
      expect(parenTest('', 'myMixin( param1, param2 )')).toBeDefined();
    });

    it('undefined if no parens on line', () => {
      expect(parenTest('', '.notAMixin ')).toBeUndefined();
    });
  });

  describe('prefer (param) over ( param )', () => {
    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('null if no extra space', () => {
      expect(parenTest('', 'myMixin(param1, param2)')).toBeNull();
      expect(parenTest('', 'myMixin( param1, param2)')).toBeNull();
      expect(parenTest('', 'myMixin(param1, param2 )')).toBeNull();
    });

    it('true if has extra spaces', () => {
      expect(parenTest('', 'myMixin( param1, param2 )')).toBeDefined();
    });

    it('undefined if no parens on line', () => {
      expect(parenTest('', '.notAMixin ')).toBeUndefined();
    });
  });
});
