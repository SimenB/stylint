'use strict';

const assert = require('assert');
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
    assert.equal(false, stackedTest('margin 0 auto'));
  });

  it('true if one liner', () => {
    assert.ok(stackedTest('margin 0 auto; padding: 5px;'));
    assert.ok(stackedTest('margin 0 auto; padding: 5px'));
  });
});
