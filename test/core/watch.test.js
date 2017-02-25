'use strict';

const path = require('path');
const assert = require('assert');
require('chai').should(); // add should assertions on top
const sinon = require('sinon');
const chokidar = require('chokidar');
const touch = require('touch');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe('Watch: ', () => {
  beforeEach(() => {
    sinon.spy(app, 'watch');

    app.watcher = undefined;
  });

  afterEach(() => {
    app.watch.restore();
    app.watcher = undefined;
  });

  it('should be a function', () => {
    app.watch.should.be.a('function');
  });

  it('watcher should be undefined if not called yet', () => {
    assert.ok(typeof app.watcher === 'undefined');
  });

  it('should set watcher if called', () => {
    app.watch();
    assert.ok(typeof app.watcher !== 'undefined');
  });

  it('should call ready event when fired', done => {
    app.watcher = chokidar.watch(app.state.path);
    app.watcher.on('ready', () => {
      done();
    });
  });

  it('should call change event when file changed', done => {
    const filePath = path.resolve(__dirname, '../../test-styl/test.styl');

    app.watcher = chokidar.watch(filePath);
    app.watcher.on('change', () => {
      done();
    });

    touch(filePath);
  });
});
