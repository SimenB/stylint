'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.strictMode = true;
app.state.quiet = true;
app.state.watching = true;

const validTest = app.lintMethods.valid.bind(app);

describe('valid property', () => {
  beforeEach(() => {
    app.state.severity = 'warning';
    app.state.keyframes = false;
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  it('true if from or to used INSIDE keyframes', () => {
    app.state.keyframes = true;
    assert.ok(validTest('from 0%'));
    assert.ok(validTest('to 100%'));
  });

  it('false if property not valid', () => {
    app.cache.mixins = [];
    assert.equal(false, validTest('marg 0 auto'));
    assert.equal(false, validTest('pad 0'));
    assert.equal(false, validTest('dog: irish-setter }'));
    assert.equal(false, validTest('{const name}'));
    assert.equal(false, validTest('div[attribute test]'));
    assert.equal(false, validTest('::selects'));
    assert.equal(false, validTest('nonsense:active'));
    assert.equal(false, validTest('test-mixin: $val'));
    assert.equal(false, validTest('mixin 5px'));
    assert.equal(false, validTest('multiplyBy5 10 5'));
    assert.equal(false, validTest('test-mixin $val'));
  });

  it('true if property is valid', () => {
    assert.ok(validTest('background'));
    assert.ok(validTest('border-bottom 0'));
    assert.ok(validTest('margin-top 0'));
    assert.ok(validTest('padding 0'));
    assert.ok(validTest('-webkit-border-radius 0'));
    assert.ok(validTest('input'));
    assert.ok(validTest('body'));
    assert.ok(validTest('::selection'));
    assert.ok(validTest('div:hover'));
    assert.ok(validTest('button:active'));
    assert.ok(validTest('p:optional'));
    assert.ok(validTest('p.classname'));
    assert.ok(validTest('div[attribute]'));
    assert.ok(validTest('picture'));
    assert.ok(validTest('source'));
    assert.ok(validTest('src: "url/to/font"'));
    assert.ok(validTest('background linear-gradient(to top, grey 50%, transparent 50%)'));
    assert.ok(validTest('img.attachment-event_thumb_single'));
    assert.ok(validTest('a.b-logo'));
  });

  it('true if syntax, class, id, interpolation, attribute, mixin etc', () => {
    assert.ok(validTest('.el:hover'));
    assert.ok(validTest('$const-name = '));
    assert.ok(validTest('{const-name}'));
    assert.ok(validTest('my-hash = {'));
    assert.ok(validTest('for i in 0..9'));
    assert.ok(validTest('&--append-class-name'));
    assert.ok(validTest('[data-js]'));
    assert.ok(validTest('#id:hover'));
    assert.ok(validTest('transition( opacity )'));
    assert.ok(validTest('return $val'));
    assert.ok(validTest('width calc(100% - 16px)'));
  });

  it('true if transparent mixin (thats been declared)', () => {
    app.cache.customProperties = ['test-mixin', 'mixin', 'multiplyBy'];

    assert.ok(validTest('test-mixin: $val'));
    assert.ok(validTest('mixin 5px'));
    assert.ok(validTest('multiplyBy 10 5'));
    assert.ok(validTest('test-mixin $val'));
  });

  it('undefined if from or to used outside keyframes', () => {
    assert.equal(undefined, validTest('from 0%'));
    assert.equal(undefined, validTest('to 100%'));
  });

  it('true if pseudo is standalone and valid', () => {
    assert.ok(validTest('::-webkit-resizer'));
    assert.ok(validTest('::-webkit-scrollbar'));
    assert.ok(validTest('::-moz-inner-focus'));
    assert.ok(validTest(':focus'));
    assert.ok(validTest('::placeholder'));
  });

  it('false if pseudo is standalone and not valid', () => {
    assert.equal(false, validTest('::-any-thing'));
    assert.equal(false, validTest(':focush'));
  });
});
