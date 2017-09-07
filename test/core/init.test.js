'use strict';

const sinon = require('sinon');
const stylint = require('../../index');

const mockFormatterValue = 'pew pew';
const mockGetFormatter = jest.fn().mockReturnValue(mockFormatterValue);
jest.mock('../../src/utils/getFormatter', () => mockGetFormatter);

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

  it('set path if one passed in', () => {
    app.state.path = null;
    app.init(null, 'test-styl/');
    expect(app.state.path).toEqual('test-styl/');
  });

  it('set path if state.path is set', () => {
    app.state.path = 'test-styl/';
    app.init();
    expect(app.state.path).toEqual('test-styl/');
  });

  it('override state.path if one is passed in', () => {
    app.state.path = 'test-styl/';
    app.init(null, 'test-styl/test2.styl');
    expect(app.state.path).toEqual('test-styl/test2.styl');
  });

  it('set path to cwd if none passed in', () => {
    app.state.path = null;
    app.init();
    expect(app.state.path).toEqual(process.cwd());
  });

  it('set formatter to the value returned by the formatter retrieval method', () => {
    app.init();

    expect(app.formatter).toBe(mockFormatterValue);
  });

  it('use formatter from user options if provided', () => {
    const options = { formatter: 'woot woot' };

    app.init(options);
    expect(mockGetFormatter).toHaveBeenLastCalledWith(options.formatter);
  });

  it('use formatter from configuration options if user formatter is not provided', () => {
    app.init();
    expect(mockGetFormatter).toHaveBeenLastCalledWith(app.config.formatter.name);
  });

  it('use custom config if passed --config flag', () => {
    app.init({
      config: './.stylintrc',
    });
    expect(app.config).toEqual(app.setConfig('./.stylintrc'));
  });

  // TODO: Makes jest throw
  it.skip('call watch if passed --watch flag', () => {
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
