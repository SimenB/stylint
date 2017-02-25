'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;
app.state.conf = true;

const importantTest = app.lintMethods.noImportant.bind(app);

describe('noImportant: disallow !important', () => {
  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if a line doesnt have !important', () => {
    assert.equal(false, importantTest('.foo'));
  });

  it('true if line has an !important', () => {
    assert.ok(importantTest('margin 5px !important'));
  });
});
