'use strict';

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
    expect(colorsTest('#aaa')).toBeUndefined();
  });

  it('false if a line doesnt have a hex color', () => {
    expect(colorsTest('color: red')).toEqual(false);
  });

  it('true if line has hex color', () => {
    expect(colorsTest('color: #fff')).toEqual(true);
  });

  it('undefined if hex color is being assigned to a variable', () => {
    expect(colorsTest('$foobar ?= #fff')).toBeUndefined();
    expect(colorsTest('$foobar = #fff')).toBeUndefined();
  });
});
