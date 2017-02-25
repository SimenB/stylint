'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const cssTest = app.lintMethods.cssLiteral.bind(app);

describe('css literal', () => {
  beforeEach(() => {
    app.state.strictMode = true;
    app.state.conf = 'always';
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if @css is not used', () => {
    app.state.hashOrCSS = false;
    expect(cssTest('margin 0')).toEqual(false);
    expect(cssTest('@extends $placeholderconst')).toEqual(false);
    expect(cssTest('@require "lint.styl"')).toEqual(false);
  });

  it('true if @css is used ', () => {
    expect(cssTest('@css {')).toBeDefined();
  });

  it('undefined if already in css literal', () => {
    app.state.hashOrCSS = true;
    expect(cssTest('.test')).toBeUndefined();
  });
});
