'use strict';

const assert = require('assert');
require('chai').should(); // add should assertions on top
const sinon = require('sinon');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe('Init should: ', () => {
  beforeEach(() => {
    sinon.spy(app, 'init');
  });

  afterEach(() => {
    app.init.restore();
  });

  it('be a function', () => {
    app.init.should.be.a('function');
  });

  it('set path if one passed in', () => {
    app.state.path = null;
    app.init(null, 'test-styl/');
    assert.equal(app.state.path, 'test-styl/');
  });

  it('set path if state.path is set', () => {
    app.state.path = 'test-styl/';
    app.init();
    assert.equal(app.state.path, 'test-styl/');
  });

  it('override state.path if one is passed in', () => {
    app.state.path = 'test-styl/';
    app.init(null, 'test-styl/test2.styl');
    assert.equal(app.state.path, 'test-styl/test2.styl');
  });

  it('set path to cwd if none passed in', () => {
    app.state.path = null;
    app.init();
    assert.equal(app.state.path, process.cwd());
  });

  it('set reporter if default if one not passed in', () => {
    app.config.reporter = undefined;
    app.init();
    assert.ok(app.reporter !== false);
  });

  it('use custom config if passed --config flag', () => {
    app.init({
      config: './.stylintrc',
    });
    assert.deepEqual(app.config, app.setConfig('./.stylintrc'));
  });

  it('call watch if passed --watch flag', () => {
    app.init({
      watch: true,
    });
    app.init.getCall(0).returned(sinon.match.same(app.watch));
  });

  it('return read if no flags', () => {
    app.init();
    app.init.getCall(0).returned(sinon.match.same(app.read));
  });
});

