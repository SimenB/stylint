'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;
app.state.strictMode = true;

const indentTest = app.lintMethods.indentPref.bind(app);

describe('indent pref', () => {
  beforeEach(() => {
    app.state.conf = 2;
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if line indented with incorrect # of spaces', () => {
    app.state.context = 1.5;
    expect(indentTest('   .test')).toEqual(false);
    app.state.context = 0.5;
    expect(indentTest(' .test2')).toEqual(false);
  });

  it('true if line indented with correct # of spaces', () => {
    app.state.context = 1;
    expect(indentTest('  .test')).toBeDefined();
    app.state.context = 2;
    expect(indentTest('    .test2')).toBeDefined();
  });
});
