'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const extendTest = app.lintMethods.extendPref.bind(app);

describe('extends style', () => {
  afterEach(() => {
    app.cache.messages = [];
  });

  describe('prefer @extends over @extend', () => {
    beforeEach(() => {
      app.state.conf = '@extends';
    });

    it('false if value already matches preferred style', () => {
      assert.equal(false, extendTest('@extends $placeHolderconst'));
    });

    it('true if value doesnt match preferred style', () => {
      assert.ok(extendTest('@extend $placeHolderconst'));
    });

    it('undefined if no extend on line', () => {
      assert.equal(undefined, extendTest('$var = #fff'));
    });
  });

  describe('prefer @extend over @extends', () => {
    beforeEach(() => {
      app.state.conf = '@extend';
    });

    it('false if value already matches preferred style', () => {
      assert.equal(false, extendTest('@extend $placeHolderconst'));
    });

    it('true if value doesnt match preferred style', () => {
      assert.ok(extendTest('@extends $placeHolderconst'));
    });

    it('undefined if no extend on line', () => {
      assert.equal(undefined, extendTest('$var = #fff'));
    });
  });
});
