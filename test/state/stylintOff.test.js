'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const toggleTest = app.stylintOff.bind(app);

describe('stylint off toggle:', () => {
  it('false if tests enabled and toggle found', () => {
    app.state.testsEnabled = true;
    expect(toggleTest('@stylint off')).toEqual(false);
  });

  it('true if tests enabled and toggle not found', () => {
    app.state.testsEnabled = true;
    expect(toggleTest('margin 0 auto')).toBeDefined();
  });

  it('undefined if tests already disabled', () => {
    app.state.testsEnabled = false;
    expect(toggleTest('@stylint on')).toBeUndefined();
  });
});
