'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;
app.state.strictMode = true;

const nestTest = app.lintMethods.depthLimit.bind(app);

describe('depthLimit', () => {
  beforeEach(() => {
    app.state.conf = 'always';
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if less indents than depth limit', () => {
    app.config.depthLimit = 4;
    app.config.indentPref = 4;
    app.state.context = app.setContext('margin 0');
    assert.equal(false, nestTest('margin 0'));
    app.state.context = app.setContext('      margin 0');
    assert.equal(false, nestTest('      margin 0'));
    app.state.context = app.setContext('    margin 0                             ');
    assert.equal(false, nestTest('      margin 0'));
    app.config.indentPref = 'tabs';
    app.state.context = app.setContext('&:hover');
    assert.equal(false, nestTest('&:hover'));
    assert.equal(false, nestTest('      &:hover'));
    app.state.context = app.setContext('.class-name');
    assert.equal(false, nestTest('.class-name'));
    assert.equal(false, nestTest('    .class-name                '));
  });

  it('true if more indents than depth limit', () => {
    app.config.depthLimit = 2;
    app.config.indentPref = 2;
    app.state.context = app.setContext('       margin 0');
    assert.ok(nestTest('       margin 0'));
    app.config.indentPref = 4;
    app.state.context = app.setContext('          margin 0');
    assert.ok(nestTest('          margin 0'));
    app.config.depthLimit = 4;
    app.state.context = app.setContext('                   margin 0');
    assert.ok(nestTest('                   margin 0'));
    app.config.indentPref = 'tabs';
    app.state.context = app.setContext('          margin 0');
    assert.ok(nestTest('          margin 0'));
    app.config.depthLimit = 1;
    app.state.context = app.setContext('    margin 0 )');
    assert.ok(nestTest('    margin 0 )'));
  });
});
