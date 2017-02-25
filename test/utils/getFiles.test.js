'use strict';

const sinon = require('sinon');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

// TODO: This test fails during coverage runs...
describe.skip('Get Files should: ', () => {
  beforeEach(() => {
    sinon.spy(app, 'getFiles');
  });

  afterEach(() => {
    app.getFiles.restore();
  });

  it('return app.parse if passed directory', () => {
    app.getFiles('/styl');
    app.getFiles.getCall(0).returned(sinon.match.same(app.parse));
  });

  it('return app.parse if passed filename', () => {
    app.getFiles('/styl/test2.styl');
    app.getFiles.getCall(0).returned(sinon.match.same(app.parse));
  });

  it('return app.parse if passed array of files', () => {
    app.getFiles(['/styl/test2.styl']);
    app.getFiles.getCall(0).returned(sinon.match.same(app.parse));
  });
});
