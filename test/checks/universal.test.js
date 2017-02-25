'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.strictMode = true;
app.state.quiet = true;
app.state.watching = true;

const universalTest = app.lintMethods.universal.bind(app);

describe('universal selector', () => {
  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if no invalid * is found', () => {
    assert.equal(false, universalTest('return ( $width*$height )'));
    assert.equal(false, universalTest('content: "*"'));
  });

  it('true if * is found', () => {
    assert.ok(universalTest('*'));
    assert.ok(universalTest('*:before'));
    assert.ok(universalTest('*::after'));
  });

  it('undefined if no * on line', () => {
    assert.equal(undefined, universalTest('img'));
  });
});
