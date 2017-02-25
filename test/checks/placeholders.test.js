'use strict';

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
    expect(placeholderTest('@extend .notVar')).toEqual(false);
    expect(placeholderTest('@extends .notVar')).toEqual(false);
  });

  it('false if @extend by itself', () => {
    expect(placeholderTest('@extend$placeholderconst')).toEqual(false);
    expect(placeholderTest('@extends')).toEqual(false);
  });

  it('true if placeholder var is used', () => {
    expect(placeholderTest('@extends $placeholderconst')).toBeDefined();
    expect(placeholderTest('@extend $placeholderconst')).toBeDefined();
  });

  it('undefined if no extend found', () => {
    expect(placeholderTest('margin 0')).toBeUndefined();
  });
});
