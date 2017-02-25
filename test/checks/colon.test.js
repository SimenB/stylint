'use strict';

const assert = require('assert');
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
      assert.ok(colonTest('margin: 0 auto'));
    });

    it('undefined if html', () => {
      assert.equal(undefined, colonTest('div'));
    });

    it('undefined if no colon found', () => {
      assert.equal(undefined, colonTest('margin 0 auto'));
      assert.equal(undefined, colonTest('&:hover'));
      assert.equal(undefined, colonTest(':global'));
      assert.equal(undefined, colonTest(':local'));
    });

    it('undefined if root context', () => {
      app.state.context = 0;
      assert.equal(undefined, colonTest('margin 0 auto'));
      app.state.hash = true;
      assert.equal(undefined, colonTest('key: value'));
    });

    it('undefined if hash', () => {
      app.state.hash = true;
      assert.equal(undefined, colonTest('key: value'));
    });

    it('undefined if syntax or css selector', () => {
      assert.equal(undefined, colonTest('#id'));
      assert.equal(undefined, colonTest('$.some-class'));
      assert.equal(undefined, colonTest('> child selector'));
      assert.equal(undefined, colonTest('.class-name'));
      assert.equal(undefined, colonTest('for ( 0..9 )'));
      assert.equal(undefined, colonTest('@media $med'));
      assert.equal(undefined, colonTest('if ( $var == 50px )'));
      assert.equal(undefined, colonTest('hash = {'));
      assert.equal(undefined, colonTest('}'));
      assert.equal(undefined, colonTest('.class-name a'));
      assert.equal(undefined, colonTest('&.class-name a'));
      assert.equal(undefined, colonTest('&:active'));
      assert.equal(undefined, colonTest('return: $value'));
      assert.equal(undefined, colonTest('return $value'));
      assert.equal(undefined, colonTest('@media screen and (max-width: 1183px)'));
    });
  });

  describe('always: prefer margin: 0 over margin 0', () => {
    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('false if no colon is found', () => {
      app.state.context = 1;
      assert.equal(false, colonTest('margin 0 auto'));
    });

    it('undefined if html', () => {
      assert.equal(undefined, colonTest('div'));
    });

    it('undefined if root context', () => {
      app.state.context = 0;
      assert.equal(undefined, colonTest('margin: 0 auto'));
    });

    it('undefined if colon found', () => {
      assert.equal(undefined, colonTest('background-image: '));
      assert.equal(undefined, colonTest('margin: 0 auto'));
      assert.equal(undefined, colonTest('margin: 0 auto;'));
    });

    it('undefined if syntax or css selector', () => {
      assert.equal(undefined, colonTest('#id'));
      assert.equal(undefined, colonTest('$.some-class'));
      assert.equal(undefined, colonTest('> child selector'));
      assert.equal(undefined, colonTest('.class-name'));
      assert.equal(undefined, colonTest('for ( 0..9 )'));
      assert.equal(undefined, colonTest('@media $med'));
      assert.equal(undefined, colonTest('@extend $med'));
      assert.equal(undefined, colonTest('@extends $med'));
      assert.equal(undefined, colonTest('@import _some-file'));
      assert.equal(undefined, colonTest('.class-name, #id-name'));
      assert.equal(undefined, colonTest('.class-name + #id-name'));
      assert.equal(undefined, colonTest('p ~ ul'));
      assert.equal(undefined, colonTest('p > ul'));
      assert.equal(undefined, colonTest('if ( $var == 50px )'));
      assert.equal(undefined, colonTest('hash = {'));
      assert.equal(undefined, colonTest('}'));
      assert.equal(undefined, colonTest('.class-name a'));
      assert.equal(undefined, colonTest('&.class-name a'));
      assert.equal(undefined, colonTest('&:active'));
      assert.equal(undefined, colonTest('return: $value'));
      assert.equal(undefined, colonTest('return $value'));
      assert.equal(undefined, colonTest('@media screen and (max-width: 1183px)'));
    });
  });
});
