'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const bracketsTest = app.lintMethods.brackets.bind(app);

describe('brackets', () => {
  beforeEach(() => {
    app.state.conf = 'always';
    app.state.hashOrCSS = false;
    app.state.openBracket = false;
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  describe('always use brackets', () => {
    it('false if no bracket found', () => {
      expect(bracketsTest('.class-name')).toEqual(false);
      expect(bracketsTest('#id')).toEqual(false);
      expect(bracketsTest('body.main')).toEqual(false);
      expect(bracketsTest('+ span')).toEqual(false);
    });

    it('true if bracket found', () => {
      expect(bracketsTest('body {')).toEqual(true);
      expect(bracketsTest('+ span {')).toEqual(true);
      expect(bracketsTest('div.div {')).toEqual(true);
      expect(bracketsTest('.class-name {')).toEqual(true);
      expect(bracketsTest('#id {')).toEqual(true);
    });

    it('true if hash', () => {
      app.state.hashOrCSS = true;
      expect(bracketsTest('.something')).toBeUndefined();
    });

    it('undefined if css or ,$ or } or =', () => {
      expect(bracketsTest('.my-class,')).toBeUndefined();
      expect(bracketsTest('margin 0')).toBeUndefined();
      expect(bracketsTest('pointer-events none')).toBeUndefined();
      expect(bracketsTest('}')).toBeUndefined();
      expect(bracketsTest('$b = { "bar": "baz" }')).toBeUndefined();
      expect(bracketsTest('{ "foo" }')).toBeUndefined();
      expect(bracketsTest('{foo() + "bar"}')).toBeUndefined();
      expect(bracketsTest('$foo = {')).toBeUndefined();
      expect(bracketsTest('$foo-color ?= #0976b5;')).toBeUndefined();
      expect(bracketsTest('$x += $i;')).toBeUndefined();
    });

    it('undefined if empty', () => {
      expect(bracketsTest('  ')).toBeUndefined();
    });
  });

  describe('disallow brackets', () => {
    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if no bracket found', () => {
      app.state.hashOrCSS = false;
      expect(bracketsTest('.class-name')).toEqual(false);
      expect(bracketsTest('div')).toEqual(false);
    });

    it('false if incorrect config', () => {
      app.state.conf = 'something';
      expect(bracketsTest('div {')).toEqual(false);
    });

    it('true if bracket found, not in hash', () => {
      app.state.hashOrCSS = false;
      expect(bracketsTest('.class-name {')).toEqual(true);
      expect(bracketsTest('div {')).toEqual(true);
      expect(bracketsTest('}')).toEqual(true);
    });

    it('undefined if in hash or syntax', () => {
      app.state.hashOrCSS = true;
      expect(bracketsTest('}')).toBeUndefined();
      expect(bracketsTest('{')).toBeUndefined();
      expect(bracketsTest('{interpolation}')).toBeUndefined();
      expect(bracketsTest('.class-name-with-{i}')).toBeUndefined();
      expect(bracketsTest('$b = { "bar": "baz" }')).toBeUndefined();
      expect(bracketsTest('{ "foo" }')).toBeUndefined();
      expect(bracketsTest('{foo() + "bar"}')).toBeUndefined();
      expect(bracketsTest('$foo = {')).toBeUndefined();
      expect(bracketsTest('$foo-color ?= #0976b5;')).toBeUndefined();
      expect(bracketsTest('$x += $i;')).toBeUndefined();
    });
  });
});
