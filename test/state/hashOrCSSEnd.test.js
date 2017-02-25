'use strict';

const assert = require('assert');
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
    assert.equal(false, hashTest('}'));
  });

  it('true if hash end } not found', () => {
    assert.ok(hashTest('margin 0'));
    assert.ok(hashTest('myHash = {'));
  });

  it('after finding end of hash, hash state should equal false', () => {
    assert.equal(false, hashTest('}'));
    assert.equal(false, app.state.hashOrCSS);
  });

  it('undefined if not in a hash', () => {
    app.state.hashOrCSS = false;
    assert.equal(undefined, hashTest('margin 0'));
    assert.equal(undefined, hashTest('myHash = {'));
    assert.equal(undefined, hashTest('}'));
  });
});
