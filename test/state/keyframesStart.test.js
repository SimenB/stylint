'use strict';

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
    expect(keyframesStartTest('@keyframes {')).toBeDefined();
  });

  it('true if line has vendor @keyframes', () => {
    expect(keyframesStartTest('@-webkit-keyframes {')).toBeDefined();
  });

  it('false if line isnt a start of @keyframes', () => {
    expect(keyframesStartTest('margin 0')).toEqual(false);
  });

  it('undefined if already in @keyframes', () => {
    app.state.keyframes = true;
    expect(keyframesStartTest('margin 0')).toBeUndefined();
  });
});
