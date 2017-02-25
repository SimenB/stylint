'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;
app.state.conf = true;

const whitespaceTest = app.lintMethods.trailingWhitespace.bind(app);

describe('trailing whitespace', () => {
  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if no trailing whitespace', () => {
    assert.equal(false, whitespaceTest('', 'margin 0 auto'));
  });

  it('true if whitespace found', () => {
    assert.ok(whitespaceTest('', 'margin 0 auto  '));
    assert.ok(whitespaceTest('', 'margin 0 auto '));
  });
});
