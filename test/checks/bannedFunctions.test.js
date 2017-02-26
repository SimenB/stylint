'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;
app.state.strictMode = true;
app.state.conf = true;

const bannedFunctions = app.lintMethods.bannedFunctions.bind(app);

describe('bannedFunctions: ban use of specific key words', () => {
  beforeEach(() => {
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  it("false if a line doesn't have any banned functions", () => {
    expect(bannedFunctions('.foo')).toEqual(false);
  });

  it('false if a line has banned functions but is not found', () => {
    app.config.bannedFunctions = ['translate3d'];
    expect(bannedFunctions('.foo')).toEqual(false);
  });

  it('true if line has a banned function', () => {
    app.config.bannedFunctions = ['translate3d'];
    expect(bannedFunctions('translate3d(1px, 1px, 0px)')).toEqual(true);
  });
});
