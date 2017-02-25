'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const hashTest = app.hashOrCSSStart.bind(app);

describe('hash start', () => {
  beforeEach(() => {
    app.state.conf = 'always';
    app.state.severity = 'warning';
    app.state.testsEnabled = true;
    app.state.hashOrCSS = false;
  });

  it('false if hash start not found', () => {
    expect(hashTest('$myconst =')).toEqual(false);
    expect(hashTest('myconst = @block')).toEqual(false);
    expect(hashTest('.mistakenUseOfBracket {')).toEqual(false);
    expect(hashTest('margin 0')).toEqual(false);
  });

  it('true if = and { are found on the same line (hash start)', () => {
    expect(hashTest('myHash = {')).toBeDefined();
  });

  it('app.state.hashOrCSS should be true after hash start', () => {
    hashTest('myHash = {');
    expect(app.state.hashOrCSS).toBeDefined();
  });

  it('undefined if in a hash', () => {
    app.state.hashOrCSS = true;
    expect(hashTest('myHash = {')).toBeUndefined();
  });
});
