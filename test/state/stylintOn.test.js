'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const toggleTest = app.stylintOn.bind(app);

describe('stylint on toggle:', () => {
  it('false if tests disabled and toggle not found', () => {
    app.state.testsEnabled = false;
    assert.equal(false, toggleTest('margin 0 auto'));
  });

  it('true if tests disabled and toggle found', () => {
    app.state.testsEnabled = false;
    assert.ok(toggleTest('@stylint on'));
  });

  it('undefined if tests already enabled', () => {
    app.state.testsEnabled = true;
    assert.equal(undefined, toggleTest('@stylint on'));
  });
});
