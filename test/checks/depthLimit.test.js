'use strict';

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
    expect(nestTest('margin 0')).toEqual(false);
    app.state.context = app.setContext('      margin 0');
    expect(nestTest('      margin 0')).toEqual(false);
    app.state.context = app.setContext(
      '    margin 0                             '
    );
    expect(nestTest('      margin 0')).toEqual(false);
    app.config.indentPref = 'tabs';
    app.state.context = app.setContext('&:hover');
    expect(nestTest('&:hover')).toEqual(false);
    expect(nestTest('      &:hover')).toEqual(false);
    app.state.context = app.setContext('.class-name');
    expect(nestTest('.class-name')).toEqual(false);
    expect(nestTest('    .class-name                ')).toEqual(false);
  });

  it('true if more indents than depth limit', () => {
    app.config.depthLimit = 2;
    app.config.indentPref = 2;
    app.state.context = app.setContext('       margin 0');
    expect(nestTest('       margin 0')).toBeDefined();
    app.config.indentPref = 4;
    app.state.context = app.setContext('          margin 0');
    expect(nestTest('          margin 0')).toBeDefined();
    app.config.depthLimit = 4;
    app.state.context = app.setContext('                   margin 0');
    expect(nestTest('                   margin 0')).toBeDefined();
    app.config.indentPref = 'tabs';
    app.state.context = app.setContext('          margin 0');
    expect(nestTest('          margin 0')).toBeDefined();
    app.config.depthLimit = 1;
    app.state.context = app.setContext('    margin 0 )');
    expect(nestTest('    margin 0 )')).toBeDefined();
  });
});
