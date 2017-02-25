'use strict';

const assert = require('assert');
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
    assert.equal(false, indentTest('   .test'));
    app.state.context = 0.5;
    assert.equal(false, indentTest(' .test2'));
  });

  it('true if line indented with correct # of spaces', () => {
    app.state.context = 1;
    assert.ok(indentTest('  .test'));
    app.state.context = 2;
    assert.ok(indentTest('    .test2'));
  });
});
