'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const keyframesEndTest = app.keyframesEnd.bind(app);

describe('keyframes end', () => {
  beforeEach(() => {
    app.state.conf = 'always';
    app.state.severity = 'warning';
    app.state.keyframes = true;
  });

  it('false if keyframes active and context set to 0 (keyframes ended)', () => {
    app.state.context = 0;
    assert.equal(false, keyframesEndTest('.newClass'));
  });

  it('true if line doesnt have a context of zero', () => {
    app.state.context = 1;
    assert.ok(keyframesEndTest('    from {'));
  });

  it('undefined if NOT already in @keyframes', () => {
    app.state.keyframes = false;
    assert.equal(undefined, keyframesEndTest('margin 0'));
  });
});
