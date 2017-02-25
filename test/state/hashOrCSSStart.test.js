'use strict';

const assert = require('assert');
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
    assert.equal(false, hashTest('$myconst ='));
    assert.equal(false, hashTest('myconst = @block'));
    assert.equal(false, hashTest('.mistakenUseOfBracket {'));
    assert.equal(false, hashTest('margin 0'));
  });

  it('true if = and { are found on the same line (hash start)', () => {
    assert.ok(hashTest('myHash = {'));
  });

  it('app.state.hashOrCSS should be true after hash start', () => {
    hashTest('myHash = {');
    assert.ok(app.state.hashOrCSS);
  });

  it('undefined if in a hash', () => {
    app.state.hashOrCSS = true;
    assert.equal(undefined, hashTest('myHash = {'));
  });
});
