'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const hashTest = app.hashOrCSSEnd.bind(app);

describe('hash end', () => {
  beforeEach(() => {
    app.state.conf = 'always';
    app.state.severity = 'warning';
    app.state.testsEnabled = true;
    app.state.hashOrCSS = true;
  });

  it('false if in hash and valid } found', () => {
    expect(hashTest('}')).toEqual(false);
  });

  it('true if hash end } not found', () => {
    expect(hashTest('margin 0')).toBeDefined();
    expect(hashTest('myHash = {')).toBeDefined();
  });

  it('after finding end of hash, hash state should equal false', () => {
    expect(hashTest('}')).toEqual(false);
    expect(app.state.hashOrCSS).toEqual(false);
  });

  it('undefined if not in a hash', () => {
    app.state.hashOrCSS = false;
    expect(hashTest('margin 0')).toBeUndefined();
    expect(hashTest('myHash = {')).toBeUndefined();
    expect(hashTest('}')).toBeUndefined();
  });
});
