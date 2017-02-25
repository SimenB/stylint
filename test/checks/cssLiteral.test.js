'use strict';

const assert = require('assert');
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
    assert.equal(false, cssTest('margin 0'));
    assert.equal(false, cssTest('@extends $placeholderconst'));
    assert.equal(false, cssTest('@require "lint.styl"'));
  });

  it('true if @css is used ', () => {
    assert.ok(cssTest('@css {'));
  });

  it('undefined if already in css literal', () => {
    app.state.hashOrCSS = true;
    assert.equal(undefined, cssTest('.test'));
  });
});
