/* eslint-disable no-tabs */

'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const mixed = app.lintMethods.mixed.bind(app);

describe('mixed spaces and tabs', () => {
  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if no mixed spaces and tabs found: spaces preferred', () => {
    app.config.indentPref = 4;
    assert.equal(false, mixed('', '    margin 0'));
  });

  it('false if no mixed spaces and tabs found: tabs preferred', () => {
    app.config.indentPref = 'tabs';
    assert.equal(false, mixed('', '	margin 0'));
  });

  it('true if spaces and tabs are mixed: spaces preferred', () => {
    app.config.indentPref = 4;
    assert.ok(mixed('', '  	margin 0'));
    assert.ok(mixed('', '	 padding 0em'));
  });

  it('true if spaces and tabs are mixed: tabs preferred', () => {
    app.config.indentPref = 'tabs';
    assert.ok(mixed('', '      margin 0'));
  });
});
