'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe('setState should: ', () => {
  it('return undefined if line empty', () => {
    /* eslint-disable no-useless-escape */
    // app.reporter( 'universal disallowed' )
    expect(app.setState('')).toBeUndefined();
    expect(app.setState(' ')).toBeUndefined();
    expect(app.setState('\t\t')).toBeUndefined();
    expect(app.setState('\s\s')).toBeUndefined();
    expect(app.setState('\s\t')).toBeUndefined();
    /* eslint-enable */
  });

  it('return undefined if @stylint ignore comment', () => {
    expect(app.setState('margin 0 // @stylint ignore')).toBeUndefined();
  });

  it('return undefined if @stylint off comment', () => {
    app.cache.source = '// @stylint off';
    expect(app.setState('// @stylint off')).toBeUndefined();
  });

  it('testsEnabled should set to false now', () => {
    expect(app.state.testsEnabled).toEqual(false);
  });

  it('return undefined if @stylint on comment', () => {
    app.cache.source = '// @stylint on';
    expect(app.setState('// @stylint on')).toBeUndefined();
  });

  it('testsEnabled should set to true now', () => {
    expect(app.state.testsEnabled).toBeTruthy();
  });

  it('return undefined if hash starting', () => {
    expect(app.setState('my-hash = {')).toBeUndefined();
  });

  it('hashOrCSS should be set to true now', () => {
    expect(app.state.hashOrCSS).toBeTruthy();
  });

  it('return undefined if hash ending', () => {
    app.state.testsEnabled = true;
    expect(app.setState('}')).toBeUndefined();
  });

  it('hashOrCSS should be set to false now', () => {
    expect(app.state.hashOrCSS).toEqual(false);
  });

  it('return undefined if keyframes starting', () => {
    expect(app.setState('@keyframes')).toBeUndefined();
  });

  it('keyframes should be set to true now', () => {
    expect(app.state.keyframes).toBeTruthy();
  });

  it('return undefined if keyframes ending', () => {
    expect(app.setState('')).toBeUndefined();
  });

  it('keyframes should be set to false now', () => {
    expect(app.state.keyframes).toEqual(false);
  });

  it('return undefined if line is just a comment', () => {
    expect(app.setState('// stuff about this code')).toBeUndefined();
  });
});
