'use strict';

const assert = require('assert');
require('chai').should(); // add should assertions on top
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe('setState should: ', () => {
  it('be a function', () => {
    app.setState.should.be.a('function');
  });

  it('return undefined if line empty', () => {
    /* eslint-disable no-useless-escape */
    // app.reporter( 'universal disallowed' )
    assert.equal(undefined, app.setState(''));
    assert.equal(undefined, app.setState(' '));
    assert.equal(undefined, app.setState('\t\t'));
    assert.equal(undefined, app.setState('\s\s'));
    assert.equal(undefined, app.setState('\s\t'));
    /* eslint-enable */
  });

  it('return undefined if @stylint ignore comment', () => {
    assert.equal(undefined, app.setState('margin 0 // @stylint ignore'));
  });

  it('return undefined if @stylint off comment', () => {
    app.cache.source = '// @stylint off';
    assert.equal(undefined, app.setState('// @stylint off'));
  });

  it('testsEnabled should set to false now', () => {
    assert.equal(false, app.state.testsEnabled);
  });

  it('return undefined if @stylint on comment', () => {
    app.cache.source = '// @stylint on';
    assert.equal(undefined, app.setState('// @stylint on'));
  });

  it('testsEnabled should set to true now', () => {
    assert.ok(app.state.testsEnabled);
  });

  it('return undefined if hash starting', () => {
    assert.equal(undefined, app.setState('my-hash = {'));
  });

  it('hashOrCSS should be set to true now', () => {
    assert.ok(app.state.hashOrCSS);
  });

  it('return undefined if hash ending', () => {
    app.state.testsEnabled = true;
    assert.equal(undefined, app.setState('}'));
  });

  it('hashOrCSS should be set to false now', () => {
    assert.equal(false, app.state.hashOrCSS);
  });

  it('return undefined if keyframes starting', () => {
    assert.equal(undefined, app.setState('@keyframes'));
  });

  it('keyframes should be set to true now', () => {
    assert.ok(app.state.keyframes);
  });

  it('return undefined if keyframes ending', () => {
    assert.equal(undefined, app.setState(''));
  });

  it('keyframes should be set to false now', () => {
    assert.equal(false, app.state.keyframes);
  });

  it('return undefined if line is just a comment', () => {
    assert.equal(undefined, app.setState('// stuff about this code'));
  });
});
