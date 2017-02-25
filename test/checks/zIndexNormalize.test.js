'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.strictMode = true;
app.state.quiet = true;
app.state.watching = true;

const zNormalizrTest = app.lintMethods.zIndexNormalize.bind(app);

describe('zIndex Normalizer', () => {
  beforeEach(() => {
    app.state.conf = 5;
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if z index value already normalized', () => {
    assert.equal(false, zNormalizrTest('z-index 5'));
  });

  it('false if no z-index', () => {
    assert.equal(false, zNormalizrTest('margin 5px'));
  });

  it('true if z index value needs to be normalized', () => {
    assert.ok(zNormalizrTest('z-index 4'));
  });

  it('undefined if 0 or -1', () => {
    assert.equal(undefined, zNormalizrTest('z-index -1'));
    assert.equal(undefined, zNormalizrTest('z-index 0'));
  });
});
