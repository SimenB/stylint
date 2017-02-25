'use strict';

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
      expect(zeroTest('margin 50px')).toBeDefined();
      expect(zeroTest('margin: 100%')).toBeDefined();
    });

    it('true if just 0 has no unit value', () => {
      expect(zeroTest('margin 0')).toBeDefined();
    });

    // eslint-disable-next-line no-useless-escape
    it('true if \d0 + any unit type is found', () => {
      expect(zeroTest('margin 0px')).toEqual(false);
      expect(zeroTest('margin 0em')).toEqual(false);
      expect(zeroTest('margin 0rem')).toEqual(false);
      expect(zeroTest('margin 0pt')).toEqual(false);
      expect(zeroTest('margin 0pc')).toEqual(false);
      expect(zeroTest('margin 0vh')).toEqual(false);
      expect(zeroTest('margin 0vw')).toEqual(false);
      expect(zeroTest('margin 0vmin')).toEqual(false);
      expect(zeroTest('margin 0vmax')).toEqual(false);
      expect(zeroTest('margin 0mm')).toEqual(false);
      expect(zeroTest('margin 0cm')).toEqual(false);
      expect(zeroTest('margin 0in')).toEqual(false);
      expect(zeroTest('margin 0mozmm')).toEqual(false);
      expect(zeroTest('margin 0ex')).toEqual(false);
      expect(zeroTest('margin 0ch')).toEqual(false);
    });

    it('undefined if in keyframes', () => {
      app.state.keyframes = true;
      expect(zeroTest('from 0%')).toBeUndefined();
      expect(zeroTest('0% {')).toBeUndefined();
      app.state.keyframes = false;
    });

    it('undefined if no 0 on line', () => {
      expect(zeroTest('margin auto')).toBeUndefined();
      expect(zeroTest('padding 53px')).toBeUndefined();
    });

    it('undefined if relative value', () => {
      expect(zeroTest('line-height 1')).toBeUndefined();
      expect(zeroTest('font-weight 600')).toBeUndefined();
    });
  });

  describe('prefer unit values', () => {
    beforeEach(() => {
      app.state.conf = 'always';
    });

    it('false if 0 value does not have unit values', () => {
      expect(zeroTest('margin 0')).toEqual(false);
    });

    it('true if value is above 0 (like 50px)', () => {
      expect(zeroTest('margin 50px')).toBeDefined();
      expect(zeroTest('margin: 100%')).toBeDefined();
    });

    it('true if 0 + any unit type is found', () => {
      expect(zeroTest('margin 0px')).toBeDefined();
      expect(zeroTest('margin 0em')).toBeDefined();
      expect(zeroTest('margin 0rem')).toBeDefined();
      expect(zeroTest('margin 0pt')).toBeDefined();
      expect(zeroTest('margin 0pc')).toBeDefined();
      expect(zeroTest('margin 0vh')).toBeDefined();
      expect(zeroTest('margin 0vw')).toBeDefined();
      expect(zeroTest('margin 0vmin')).toBeDefined();
      expect(zeroTest('margin 0vmax')).toBeDefined();
      expect(zeroTest('margin 0mm')).toBeDefined();
      expect(zeroTest('margin 0cm')).toBeDefined();
      expect(zeroTest('margin 0in')).toBeDefined();
      expect(zeroTest('margin 0mozmm')).toBeDefined();
      expect(zeroTest('margin 0ex')).toBeDefined();
      expect(zeroTest('margin 0ch')).toBeDefined();
    });

    it('undefined if in keyframes', () => {
      app.state.keyframes = true;
      expect(zeroTest('from 0%')).toBeUndefined();
      expect(zeroTest('0% {')).toBeUndefined();
      app.state.keyframes = false;
    });

    it('undefined if no 0 on line', () => {
      expect(zeroTest('margin auto')).toBeUndefined();
      expect(zeroTest('padding 53px')).toBeUndefined();
    });

    it('undefined if relative value', () => {
      expect(zeroTest('line-height 1')).toBeUndefined();
      expect(zeroTest('font-weight 600')).toBeUndefined();
    });
  });
});
