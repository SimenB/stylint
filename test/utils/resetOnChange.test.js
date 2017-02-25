'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe('Reset (after change)', () => {
  let resetTest;

  beforeEach(() => {
    resetTest = app.resetOnChange.bind(app);

    app.state.watching = false;
  });

  it('reset on change should change dir to curr file', () => {
    resetTest('../../styl/_ads.styl');
    assert.ok(app.state.path === '../../styl/_ads.styl');
  });

  it('reset should reset all caches', () => {
    resetTest('../../styl/_ads.styl');
    assert.ok(
      Object.keys(app.cache.sCache).length === 0 &&
      app.cache.alphaCache.length === 0 &&
      app.cache.rootCache.length === 0 &&
      app.cache.prevLine.length === 0 &&
      app.cache.prevFile.length === 0 &&
      app.cache.prevContext === 0 &&
      app.cache.zCache.length === 0
    );
  });

  it('reset should set prevLine and prevFile to empty strings', () => {
    resetTest('../../styl/_ads.styl');
    assert.ok(
      app.cache.prevLine === '' &&
      app.cache.prevFile === ''
    );
  });

  it('reset should set prevContext to 0', () => {
    resetTest('../../styl/_ads.styl');
    assert.ok(app.cache.prevContext === 0);
  });
});
