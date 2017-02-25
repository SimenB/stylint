'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const colorsTest = app.lintMethods.colors.bind(app);

describe('colors', () => {
  beforeEach(() => {
    app.state.conf = true;
  });

  it('undefined if line is an id selector', () => {
    assert.equal(undefined, colorsTest('#aaa'));
  });

  it('false if a line doesnt have a hex color', () => {
    assert.equal(false, colorsTest('color: red'));
  });

  it('true if line has hex color', () => {
    assert.ok(colorsTest('color: #fff'));
  });

  it('undefined if hex color is being assigned to a variable', () => {
    assert.equal(undefined, colorsTest('$foobar ?= #fff'));
    assert.equal(undefined, colorsTest('$foobar = #fff'));
  });
});
