'use strict';

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
      expect(efficientTest('margin 0 0 0 0')).toEqual(false);
      expect(efficientTest('margin 0 0 0')).toEqual(false);
      expect(efficientTest('margin 0 0')).toEqual(false);
      expect(efficientTest('margin 0 5px 0 5px')).toEqual(false);
      expect(efficientTest('margin 5px 0 5px')).toEqual(false);
      expect(efficientTest('margin 5px 0 5px 0')).toEqual(false);
      expect(efficientTest('margin 0 5px 0')).toEqual(false);
      expect(efficientTest('margin 0 5px 5px 5px')).toEqual(false);
      expect(efficientTest('padding 0 0 0 0')).toEqual(false);
      expect(efficientTest('padding 0 0 0')).toEqual(false);
      expect(efficientTest('padding 0 0')).toEqual(false);
      expect(efficientTest('padding 0 5px 0 5px')).toEqual(false);
      expect(efficientTest('padding 5px 0 5px')).toEqual(false);
      expect(efficientTest('padding 5px 0 5px 0')).toEqual(false);
      expect(efficientTest('padding 0 5px 0')).toEqual(false);
      expect(efficientTest('padding 0 5px 5px 5px')).toEqual(false);
    });

    it('true if value is efficient', () => {
      expect(efficientTest('margin 0 5px')).toBeDefined();
      expect(efficientTest('margin: 5px 0')).toBeDefined();
      expect(efficientTest('margin 5px 0 0')).toBeDefined();
      expect(efficientTest('margin 0')).toBeDefined();
      expect(efficientTest('margin 5px')).toBeDefined();
      expect(efficientTest('padding 0 5px')).toBeDefined();
      expect(efficientTest('padding 5px 0')).toBeDefined();
      expect(efficientTest('padding 5px 0 0')).toBeDefined();
      expect(efficientTest('padding: 0')).toBeDefined();
      expect(efficientTest('padding 5px')).toBeDefined();
      expect(efficientTest('padding: 1px 2px 3px 4px')).toBeDefined();
    });

    it('undefined if nothing to test', () => {
      app.cache.line = 'border 0';
      expect(efficientTest()).toBeUndefined();
    });
  });

  describe('prefer margin 0 0 0 0 over margin 0', () => {
    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if value is not efficient', () => {
      expect(efficientTest('margin 0 0 0 0')).toEqual(false);
      expect(efficientTest('margin 0 0 0')).toEqual(false);
      expect(efficientTest('margin 0 0')).toEqual(false);
      expect(efficientTest('margin 0 5px 0 5px')).toEqual(false);
      expect(efficientTest('margin 5px 0 5px')).toEqual(false);
      expect(efficientTest('margin 5px 0 5px 0')).toEqual(false);
      expect(efficientTest('margin 0 5px 0')).toEqual(false);
      expect(efficientTest('margin 0 5px 5px 5px')).toEqual(false);
      expect(efficientTest('padding 0 0 0 0')).toEqual(false);
      expect(efficientTest('padding 0 0 0')).toEqual(false);
      expect(efficientTest('padding 0 0')).toEqual(false);
      expect(efficientTest('padding 0 5px 0 5px')).toEqual(false);
      expect(efficientTest('padding 5px 0 5px')).toEqual(false);
      expect(efficientTest('padding 5px 0 5px 0')).toEqual(false);
      expect(efficientTest('padding 0 5px 0')).toEqual(false);
      expect(efficientTest('padding 0 5px 5px 5px')).toEqual(false);
    });

    it('true if value is efficient', () => {
      expect(efficientTest('margin 0 5px')).toBeDefined();
      expect(efficientTest('margin: 5px 0')).toBeDefined();
      expect(efficientTest('margin 5px 0 0')).toBeDefined();
      expect(efficientTest('margin 0')).toBeDefined();
      expect(efficientTest('margin 5px')).toBeDefined();
      expect(efficientTest('padding 0 5px')).toBeDefined();
      expect(efficientTest('padding 5px 0')).toBeDefined();
      expect(efficientTest('padding 5px 0 0')).toBeDefined();
      expect(efficientTest('padding: 0')).toBeDefined();
      expect(efficientTest('padding 5px')).toBeDefined();
      expect(efficientTest('padding: 1px 2px 3px 4px')).toBeDefined();
    });

    it('undefined if nothing to test', () => {
      app.cache.line = 'border 0';
      expect(efficientTest()).toBeUndefined();
    });
  });
});
