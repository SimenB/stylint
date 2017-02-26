'use strict';

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
    expect(app.state.path).toEqual('../../styl/_ads.styl');
  });

  it('reset should reset all caches', () => {
    resetTest('../../styl/_ads.styl');
    expect(Object.keys(app.cache.sCache)).toHaveLength(0);
    expect(app.cache.alphaCache).toHaveLength(0);
    expect(app.cache.rootCache).toHaveLength(0);
    expect(app.cache.prevLine).toHaveLength(0);
    expect(app.cache.prevFile).toHaveLength(0);
    expect(app.cache.zCache).toHaveLength(0);
    expect(app.cache.prevContext).toEqual(0);
  });

  it('reset should set prevLine and prevFile to empty strings', () => {
    resetTest('../../styl/_ads.styl');
    expect(app.cache.prevLine).toEqual('');
    expect(app.cache.prevFile).toEqual('');
  });

  it('reset should set prevContext to 0', () => {
    resetTest('../../styl/_ads.styl');
    expect(app.cache.prevContext).toEqual(0);
  });
});
