/* eslint-disable no-tabs */

'use strict';

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
    expect(mixed('', '    margin 0')).toEqual(false);
  });

  it('false if no mixed spaces and tabs found: tabs preferred', () => {
    app.config.indentPref = 'tabs';
    expect(mixed('', '	margin 0')).toEqual(false);
  });

  it('true if spaces and tabs are mixed: spaces preferred', () => {
    app.config.indentPref = 4;
    expect(mixed('', '  	margin 0')).toBeDefined();
    expect(mixed('', '	 padding 0em')).toBeDefined();
  });

  it('true if spaces and tabs are mixed: tabs preferred', () => {
    app.config.indentPref = 'tabs';
    expect(mixed('', '      margin 0')).toBeDefined();
  });
});
