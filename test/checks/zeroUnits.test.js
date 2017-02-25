'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.strictMode = true;
app.state.quiet = true;
app.state.watching = true;

const zeroTest = app.lintMethods.zeroUnits.bind(app);

describe('zero units', () => {
  beforeEach(() => {
    app.state.severity = 'warning';
    app.state.keyframes = false;
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  describe('prefer no unit values', () => {
    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('true if value above 0', () => {
      assert.ok(zeroTest('margin 50px'));
      assert.ok(zeroTest('margin: 100%'));
    });

    it('true if just 0 has no unit value', () => {
      assert.ok(zeroTest('margin 0'));
    });

    // eslint-disable-next-line no-useless-escape
    it('true if \d0 + any unit type is found', () => {
      assert.equal(false, zeroTest('margin 0px'));
      assert.equal(false, zeroTest('margin 0em'));
      assert.equal(false, zeroTest('margin 0rem'));
      assert.equal(false, zeroTest('margin 0pt'));
      assert.equal(false, zeroTest('margin 0pc'));
      assert.equal(false, zeroTest('margin 0vh'));
      assert.equal(false, zeroTest('margin 0vw'));
      assert.equal(false, zeroTest('margin 0vmin'));
      assert.equal(false, zeroTest('margin 0vmax'));
      assert.equal(false, zeroTest('margin 0mm'));
      assert.equal(false, zeroTest('margin 0cm'));
      assert.equal(false, zeroTest('margin 0in'));
      assert.equal(false, zeroTest('margin 0mozmm'));
      assert.equal(false, zeroTest('margin 0ex'));
      assert.equal(false, zeroTest('margin 0ch'));
    });

    it('undefined if in keyframes', () => {
      app.state.keyframes = true;
      assert.equal(undefined, zeroTest('from 0%'));
      assert.equal(undefined, zeroTest('0% {'));
      app.state.keyframes = false;
    });

    it('undefined if no 0 on line', () => {
      assert.equal(undefined, zeroTest('margin auto'));
      assert.equal(undefined, zeroTest('padding 53px'));
    });

    it('undefined if relative value', () => {
      assert.equal(undefined, zeroTest('line-height 1'));
      assert.equal(undefined, zeroTest('font-weight 600'));
    });
  });

  describe('prefer unit values', () => {
    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('false if 0 value does not have unit values', () => {
      assert.equal(false, zeroTest('margin 0'));
    });

    it('true if value is above 0 (like 50px)', () => {
      assert.ok(zeroTest('margin 50px'));
      assert.ok(zeroTest('margin: 100%'));
    });

    it('true if 0 + any unit type is found', () => {
      assert.ok(zeroTest('margin 0px'));
      assert.ok(zeroTest('margin 0em'));
      assert.ok(zeroTest('margin 0rem'));
      assert.ok(zeroTest('margin 0pt'));
      assert.ok(zeroTest('margin 0pc'));
      assert.ok(zeroTest('margin 0vh'));
      assert.ok(zeroTest('margin 0vw'));
      assert.ok(zeroTest('margin 0vmin'));
      assert.ok(zeroTest('margin 0vmax'));
      assert.ok(zeroTest('margin 0mm'));
      assert.ok(zeroTest('margin 0cm'));
      assert.ok(zeroTest('margin 0in'));
      assert.ok(zeroTest('margin 0mozmm'));
      assert.ok(zeroTest('margin 0ex'));
      assert.ok(zeroTest('margin 0ch'));
    });

    it('undefined if in keyframes', () => {
      app.state.keyframes = true;
      assert.equal(undefined, zeroTest('from 0%'));
      assert.equal(undefined, zeroTest('0% {'));
      app.state.keyframes = false;
    });

    it('undefined if no 0 on line', () => {
      assert.equal(undefined, zeroTest('margin auto'));
      assert.equal(undefined, zeroTest('padding 53px'));
    });

    it('undefined if relative value', () => {
      assert.equal(undefined, zeroTest('line-height 1'));
      assert.equal(undefined, zeroTest('font-weight 600'));
    });
  });
});
