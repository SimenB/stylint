'use strict';

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
    expect(universalTest('return ( $width*$height )')).toEqual(false);
    expect(universalTest('content: "*"')).toEqual(false);
  });

  it('true if * is found', () => {
    expect(universalTest('*')).toBeDefined();
    expect(universalTest('*:before')).toBeDefined();
    expect(universalTest('*::after')).toBeDefined();
  });

  it('undefined if no * on line', () => {
    expect(universalTest('img')).toBeUndefined();
  });
});
