'use strict';

const assert = require('assert');
require('chai').should(); // add should assertions on top
const sinon = require('sinon');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe('Lint: ', () => {
  beforeEach(() => {
    sinon.spy(app, 'lint');
  });

  afterEach(() => {
    app.lint.restore();

    app.config.maxErrors = false;
    app.config.maxWarnings = false;
    app.cache.messages = [];
    app.cache.brackets = false;
  });

  it('should be a function', () => {
    app.lint.should.be.a('function');
  });

  it('should pick up severity of current check', () => {
    app.config.brackets = {
      expect: 'never',
      error: true,
    };

    app.lint();
    app.lint.getCall(0).returned(sinon.match.same(app.done));
  });

  it('should return done if over maxErrs', () => {
    app.config.maxErrors = 5;
    app.cache.messages.length = 6;
    app.lint();
    app.lint.getCall(0).returned(sinon.match.same(app.done));
  });

  it('should return done if over maxWarnings', () => {
    app.config.maxWarnings = 5;
    app.cache.messages.length = 6;
    app.lint();
    app.lint.getCall(0).returned(sinon.match.same(app.done));
  });

  it('should cache rule name as one of warning properties', () => {
    app.config = { brackets: 'never' };
    app.lint();
    assert.equal(app.cache.rule, 'brackets');

    app.config = { leadingZero: 'never' };
    app.lint();
    assert.equal(app.cache.rule, 'leadingZero');

    // restore config
    app.config = app.setConfig();
  });
});
