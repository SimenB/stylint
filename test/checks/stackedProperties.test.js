'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.strictMode = true;
app.state.quiet = true;
app.state.watching = true;

const stackedTest = app.lintMethods.stackedProperties.bind(app);

describe('stacked properties', () => {
  beforeEach(() => {
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if not a one liner', () => {
    expect(stackedTest('margin 0 auto')).toEqual(false);
  });

  it('true if one liner', () => {
    expect(stackedTest('margin 0 auto; padding: 5px;')).toBeDefined();
    expect(stackedTest('margin 0 auto; padding: 5px')).toBeDefined();
  });
});
