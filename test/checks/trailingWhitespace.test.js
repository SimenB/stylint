'use strict';

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
    expect(whitespaceTest('', 'margin 0 auto')).toEqual(false);
  });

  it('true if whitespace found', () => {
    expect(whitespaceTest('', 'margin 0 auto  ')).toBeDefined();
    expect(whitespaceTest('', 'margin 0 auto ')).toBeDefined();
  });
});
