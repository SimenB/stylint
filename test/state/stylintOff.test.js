'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const toggleTest = app.stylintOff.bind(app);

describe('stylint off toggle:', () => {
  it('false if tests enabled and toggle found', () => {
    app.state.testsEnabled = true;
    assert.equal(false, toggleTest('@stylint off'));
  });

  it('true if tests enabled and toggle not found', () => {
    app.state.testsEnabled = true;
    assert.ok(toggleTest('margin 0 auto'));
  });

  it('undefined if tests already disabled', () => {
    app.state.testsEnabled = false;
    assert.equal(undefined, toggleTest('@stylint on'));
  });
});
