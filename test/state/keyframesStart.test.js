'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const keyframesStartTest = app.keyframesStart.bind(app);

describe('keyframes start', () => {
  beforeEach(() => {
    app.state.conf = 'always';
    app.state.severity = 'warning';
    app.state.keyframes = false;
  });

  it('true if line has @keyframes', () => {
    assert.ok(keyframesStartTest('@keyframes {'));
  });

  it('true if line has vendor @keyframes', () => {
    assert.ok(keyframesStartTest('@-webkit-keyframes {'));
  });

  it('false if line isnt a start of @keyframes', () => {
    assert.equal(false, keyframesStartTest('margin 0'));
  });

  it('undefined if already in @keyframes', () => {
    app.state.keyframes = true;
    assert.equal(undefined, keyframesStartTest('margin 0'));
  });
});
