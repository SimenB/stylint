'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const colonTest = app.lintMethods.colons.bind(app);

describe('colon', () => {
  afterEach(() => {
    app.cache.messages = [];
  });

  describe('never: prefer margin 0 over margin: 0', () => {
    beforeEach(() => {
      app.state.conf = 'never';
    });

    afterEach(() => {
      app.state.hash = false;
    });

    it('true if unnecessary colon is found', () => {
      app.state.context = 1;
      app.state.hash = false;
      expect(colonTest('margin: 0 auto')).toBe(true);
    });

    it('undefined if html', () => {
      expect(colonTest('div')).toBeUndefined();
    });

    it('undefined if no colon found', () => {
      expect(colonTest('margin 0 auto')).toBeUndefined();
      expect(colonTest('&:hover')).toBeUndefined();
      expect(colonTest(':global')).toBeUndefined();
      expect(colonTest(':local')).toBeUndefined();
    });

    it('undefined if root context', () => {
      app.state.context = 0;
      expect(colonTest('margin 0 auto')).toBeUndefined();
      app.state.hash = true;
      expect(colonTest('key: value')).toBeUndefined();
    });

    it('undefined if hash', () => {
      app.state.hash = true;
      expect(colonTest('key: value')).toBeUndefined();
    });

    it('undefined if syntax or css selector', () => {
      expect(colonTest('#id')).toBeUndefined();
      expect(colonTest('$.some-class')).toBeUndefined();
      expect(colonTest('> child selector')).toBeUndefined();
      expect(colonTest('.class-name')).toBeUndefined();
      expect(colonTest('for ( 0..9 )')).toBeUndefined();
      expect(colonTest('@media $med')).toBeUndefined();
      expect(colonTest('if ( $var == 50px )')).toBeUndefined();
      expect(colonTest('hash = {')).toBeUndefined();
      expect(colonTest('}')).toBeUndefined();
      expect(colonTest('.class-name a')).toBeUndefined();
      expect(colonTest('&.class-name a')).toBeUndefined();
      expect(colonTest('&:active')).toBeUndefined();
      expect(colonTest('return: $value')).toBeUndefined();
      expect(colonTest('return $value')).toBeUndefined();
      expect(colonTest('@media screen and (max-width: 1183px)')).toBeUndefined();
    });
  });

  describe('always: prefer margin: 0 over margin 0', () => {
    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('false if no colon is found', () => {
      app.state.context = 1;
      expect(colonTest('margin 0 auto')).toEqual(false);
    });

    it('undefined if html', () => {
      expect(colonTest('div')).toBeUndefined();
    });

    it('undefined if root context', () => {
      app.state.context = 0;
      expect(colonTest('margin: 0 auto')).toBeUndefined();
    });

    it('undefined if colon found', () => {
      expect(colonTest('background-image: ')).toBeUndefined();
      expect(colonTest('margin: 0 auto')).toBeUndefined();
      expect(colonTest('margin: 0 auto;')).toBeUndefined();
    });

    it('undefined if syntax or css selector', () => {
      expect(colonTest('#id')).toBeUndefined();
      expect(colonTest('$.some-class')).toBeUndefined();
      expect(colonTest('> child selector')).toBeUndefined();
      expect(colonTest('.class-name')).toBeUndefined();
      expect(colonTest('for ( 0..9 )')).toBeUndefined();
      expect(colonTest('@media $med')).toBeUndefined();
      expect(colonTest('@extend $med')).toBeUndefined();
      expect(colonTest('@extends $med')).toBeUndefined();
      expect(colonTest('@import _some-file')).toBeUndefined();
      expect(colonTest('.class-name, #id-name')).toBeUndefined();
      expect(colonTest('.class-name + #id-name')).toBeUndefined();
      expect(colonTest('p ~ ul')).toBeUndefined();
      expect(colonTest('p > ul')).toBeUndefined();
      expect(colonTest('if ( $var == 50px )')).toBeUndefined();
      expect(colonTest('hash = {')).toBeUndefined();
      expect(colonTest('}')).toBeUndefined();
      expect(colonTest('.class-name a')).toBeUndefined();
      expect(colonTest('&.class-name a')).toBeUndefined();
      expect(colonTest('&:active')).toBeUndefined();
      expect(colonTest('return: $value')).toBeUndefined();
      expect(colonTest('return $value')).toBeUndefined();
      expect(colonTest('@media screen and (max-width: 1183px)')).toBeUndefined();
    });
  });
});
