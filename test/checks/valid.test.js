'use strict';

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
    expect(validTest('from 0%')).toBeDefined();
    expect(validTest('to 100%')).toBeDefined();
  });

  it('false if property not valid', () => {
    app.cache.mixins = [];
    expect(validTest('marg 0 auto')).toEqual(false);
    expect(validTest('pad 0')).toEqual(false);
    expect(validTest('dog: irish-setter }')).toEqual(false);
    expect(validTest('{const name}')).toEqual(false);
    expect(validTest('div[attribute test]')).toEqual(false);
    expect(validTest('::selects')).toEqual(false);
    expect(validTest('nonsense:active')).toEqual(false);
    expect(validTest('test-mixin: $val')).toEqual(false);
    expect(validTest('mixin 5px')).toEqual(false);
    expect(validTest('multiplyBy5 10 5')).toEqual(false);
    expect(validTest('test-mixin $val')).toEqual(false);
  });

  it('true if property is valid', () => {
    expect(validTest('background')).toBeDefined();
    expect(validTest('border-bottom 0')).toBeDefined();
    expect(validTest('margin-top 0')).toBeDefined();
    expect(validTest('padding 0')).toBeDefined();
    expect(validTest('-webkit-border-radius 0')).toBeDefined();
    expect(validTest('input')).toBeDefined();
    expect(validTest('body')).toBeDefined();
    expect(validTest('::selection')).toBeDefined();
    expect(validTest('div:hover')).toBeDefined();
    expect(validTest('button:active')).toBeDefined();
    expect(validTest('p:optional')).toBeDefined();
    expect(validTest('p.classname')).toBeDefined();
    expect(validTest('div[attribute]')).toBeDefined();
    expect(validTest('picture')).toBeDefined();
    expect(validTest('source')).toBeDefined();
    expect(validTest('src: "url/to/font"')).toBeDefined();
    expect(validTest('background linear-gradient(to top, grey 50%, transparent 50%)')).toBeDefined();
    expect(validTest('img.attachment-event_thumb_single')).toBeDefined();
    expect(validTest('a.b-logo')).toBeDefined();
  });

  it('true if syntax, class, id, interpolation, attribute, mixin etc', () => {
    expect(validTest('.el:hover')).toBeDefined();
    expect(validTest('$const-name = ')).toBeDefined();
    expect(validTest('{const-name}')).toBeDefined();
    expect(validTest('my-hash = {')).toBeDefined();
    expect(validTest('for i in 0..9')).toBeDefined();
    expect(validTest('&--append-class-name')).toBeDefined();
    expect(validTest('[data-js]')).toBeDefined();
    expect(validTest('#id:hover')).toBeDefined();
    expect(validTest('transition( opacity )')).toBeDefined();
    expect(validTest('return $val')).toBeDefined();
    expect(validTest('width calc(100% - 16px)')).toBeDefined();
  });

  it("true if transparent mixin (that's been declared)", () => {
    app.cache.customProperties = ['test-mixin', 'mixin', 'multiplyBy'];

    expect(validTest('test-mixin: $val')).toBeDefined();
    expect(validTest('mixin 5px')).toBeDefined();
    expect(validTest('multiplyBy 10 5')).toBeDefined();
    expect(validTest('test-mixin $val')).toBeDefined();
  });

  it('undefined if from or to used outside keyframes', () => {
    expect(validTest('from 0%')).toBeUndefined();
    expect(validTest('to 100%')).toBeUndefined();
  });

  it('true if pseudo is standalone and valid', () => {
    expect(validTest('::-webkit-resizer')).toBeDefined();
    expect(validTest('::-webkit-scrollbar')).toBeDefined();
    expect(validTest('::-moz-inner-focus')).toBeDefined();
    expect(validTest(':focus')).toBeDefined();
    expect(validTest('::placeholder')).toBeDefined();
  });

  it('false if pseudo is standalone and not valid', () => {
    expect(validTest('::-any-thing')).toEqual(false);
    expect(validTest(':focush')).toEqual(false);
  });
});
