'use strict';

const path = require('path');
const chokidar = require('chokidar');
const touch = require('touch');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe('Watch: ', () => {
  beforeEach(() => {
    jest.spyOn(app, 'watch');

    app.watcher = undefined;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('watcher should be undefined if not called yet', () => {
    expect(app.watcher).toBeUndefined();
  });

  it('should set watcher if called', () => {
    app.watch();
    expect(app.watcher).not.toBeUndefined();
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
