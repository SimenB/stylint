'use strict';

const sinon = require('sinon');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe.skip('Read: ', () => {
  beforeEach(() => {
    sinon.spy(app, 'read');
  });

  afterEach(() => {
    app.read.restore();
  });

  it('should be a function', () => {
    app.read.should.be.a('function');
  });

  it('return parse function if passed a dir', () => {
    app.state.path = 'test-styl/';
    app.read();
    app.read.getCall(0).returned(sinon.match.same(app.parse));
  });

  it('return parse function if passed a filename', () => {
    app.state.path = 'test-styl/test2.styl';
    app.read();
    app.read.getCall(0).returned(sinon.match.same(app.parse));
  });

  it('return parse function if nothing passed', () => {
    app.state.path = process.cwd();
    app.read();
    app.read.getCall(0).returned(sinon.match.same(app.parse));
  });
});
