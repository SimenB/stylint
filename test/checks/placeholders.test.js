'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;
app.state.conf = 'always';

const placeholderTest = app.lintMethods.placeholders.bind(app);

describe('placeholders: prefer $var over .class when extending: ', () => {
  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if placeholder var not used', () => {
    assert.equal(false, placeholderTest('@extend .notVar'));
    assert.equal(false, placeholderTest('@extends .notVar'));
  });

  it('false if @extend by itself', () => {
    assert.equal(false, placeholderTest('@extend$placeholderconst'));
    assert.equal(false, placeholderTest('@extends'));
  });

  it('true if placeholder var is used', () => {
    assert.ok(placeholderTest('@extends $placeholderconst'));
    assert.ok(placeholderTest('@extend $placeholderconst'));
  });

  it('undefined if no extend found', () => {
    assert.equal(undefined, placeholderTest('margin 0'));
  });
});
