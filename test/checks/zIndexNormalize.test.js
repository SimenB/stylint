'use strict';

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
    expect(zNormalizrTest('z-index 5')).toEqual(false);
  });

  it('false if no z-index', () => {
    expect(zNormalizrTest('margin 5px')).toEqual(false);
  });

  it('true if z index value needs to be normalized', () => {
    expect(zNormalizrTest('z-index 4')).toBeDefined();
  });

  it('undefined if 0 or -1', () => {
    expect(zNormalizrTest('z-index -1')).toBeUndefined();
    expect(zNormalizrTest('z-index 0')).toBeUndefined();
  });
});
