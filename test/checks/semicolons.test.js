'use strict';

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
      expect(semiTest('margin 0 auto;')).toEqual(true);
    });

    it('undefined if no semicolon is found', () => {
      expect(semiTest('margin 0 auto')).toBeUndefined();
      expect(semiTest('    margin 0 auto')).toBeUndefined();
      expect(semiTest('    .class-name')).toBeUndefined();
    });

    it('undefined if line skipped (syntax)', () => {
      expect(semiTest('var =')).toBeUndefined();
      expect(semiTest('var = @block')).toBeUndefined();
      expect(semiTest('for ( 0..9 )')).toBeUndefined();
      expect(semiTest('}')).toBeUndefined();
      expect(semiTest('.class-name')).toBeUndefined();
      expect(semiTest('if ( 1 > 0 )')).toBeUndefined();
      expect(semiTest('&__anything')).toBeUndefined();
      expect(semiTest('path,')).toBeUndefined();
    });
  });

  describe('always (prefer margin 0; to margin 0)', () => {
    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('false if no semicolon is found', () => {
      app.state.context = 1;
      expect(semiTest('margin 0 auto')).toEqual(false);
    });

    it('undefined if semicolon is found', () => {
      expect(semiTest('margin 0 auto;')).toBeUndefined();
    });

    it('undefined if line skipped (syntax)', () => {
      expect(semiTest('var =')).toBeUndefined();
      expect(semiTest('var = @block')).toBeUndefined();
      expect(semiTest('for ( 0..9 )')).toBeUndefined();
      expect(semiTest('}')).toBeUndefined();
      expect(semiTest('.class-name')).toBeUndefined();
      expect(semiTest('if ( 1 > 0 )')).toBeUndefined();
      expect(semiTest('&__anything')).toBeUndefined();
      expect(semiTest('path,')).toBeUndefined();
    });
  });
});
