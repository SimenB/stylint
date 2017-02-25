'use strict';

const assert = require('assert');
const sinon = require('sinon');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe.skip('Parse should: ', () => {
  beforeEach(() => {
    sinon.spy(app, 'parse');
  });

  afterEach(() => {
    app.parse.restore();
  });

  it('be a function', () => {
    app.parse.should.be.a('function');
  });

  it('throws err if passed non-existant file name', () => {
    app.cache.file = undefined;
    assert.throws(
      app.parse,
      TypeError,
      'readFile err. Did you pass in a correct filename?'
    );
  });

  it('return a forEach if passed a filename', () => {
    app.parse(false, ['test-styl/test2.styl']);
    app.parse.getCall(0).returned(sinon.match.same(['test-styl/test2.styl'].forEach));
  });

  it('return a forEach if passed a list of files', () => {
    app.parse(false, ['test-styl/test2.styl, styl/test.styl']);
    app.parse.getCall(1).returned(sinon.match.same(['test-styl/test2.styl, styl/test.styl'].forEach));
  });

  it('handle empty or one line files fine', () => {
    app.parse(false, ['test-styl/oneLine.styl']);
    app.parse.getCall(2).returned(sinon.match.same(['test-styl/oneLine.styl'].forEach));
  });

  it('returns app.done when done parsing last file', () => {
    app.cache.fileNo = app.cache.filesLen;
    app.parse(false, ['test-styl/test2.styl']);
    app.parse.getCall(3).returned(sinon.match.same(app.done));
  });
});
