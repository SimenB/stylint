'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.strictMode = true;
app.state.quiet = true;
app.state.watching = true;

const noneTest = app.lintMethods.none.bind(app);

describe('none', () => {
  beforeEach(() => {
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  describe('prefer 0 over none', () => {
    before(() => {
      app.state.conf = 'never';
    });

    it('false (no err) if border 0', () => {
      assert.equal(false, noneTest('border 0'));
      assert.equal(false, noneTest('border: 0'));
      assert.equal(false, noneTest('border:0'));
      assert.equal(false, noneTest('border 1px solid red'));
    });

    it('false (no err) if outline 0', () => {
      assert.equal(false, noneTest('outline 0'));
      assert.equal(false, noneTest('outline: 0'));
      assert.equal(false, noneTest('outline:0'));
      assert.equal(false, noneTest('outline 1px solid red'));
    });

    it('true (err found) if border none', () => {
      assert.ok(noneTest('border none'));
      assert.ok(noneTest('border: none'));
      assert.ok(noneTest('border:none'));
    });

    it('true (err found) if outline none', () => {
      assert.ok(noneTest('outline none'));
      assert.ok(noneTest('outline: none'));
      assert.ok(noneTest('outline:none'));
    });

    it('undefined if border or outline not on line', () => {
      assert.equal(undefined, noneTest('margin 0'));
      assert.equal(undefined, noneTest('padding inherit'));
    });
  });

  describe('prefer none over 0', () => {
    before(() => {
      app.state.conf = 'always';
    });

    it('false (no err) if border none', () => {
      assert.ok(!noneTest('border none'));
      assert.ok(!noneTest('border: none'));
      assert.ok(!noneTest('border:none'));
      assert.ok(!noneTest('border 1px solid red'));
    });

    it('false (no err) if outline none', () => {
      assert.ok(!noneTest('outline none'));
      assert.ok(!noneTest('outline: none'));
      assert.ok(!noneTest('outline:none'));
      assert.ok(!noneTest('outline 1px solid red'));
    });

    it('true (err) if border 0 or not applicable', () => {
      assert.ok(noneTest('border 0'));
      assert.ok(noneTest('border: 0'));
      assert.ok(noneTest('border:0'));
    });

    it('true (err) if outline 0 or not applicable', () => {
      assert.ok(noneTest('outline 0'));
      assert.ok(noneTest('outline: 0'));
      assert.ok(noneTest('outline:0'));
    });

    it('undefined if border or outline not on line', () => {
      assert.equal(undefined, noneTest('margin 0'));
      assert.equal(undefined, noneTest('padding inherit'));
    });
  });
});
