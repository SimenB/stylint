'use strict';

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
      expect(extendTest('@extends $placeHolderconst')).toEqual(false);
    });

    it('true if value doesnt match preferred style', () => {
      expect(extendTest('@extend $placeHolderconst')).toBeDefined();
    });

    it('undefined if no extend on line', () => {
      expect(extendTest('$var = #fff')).toBeUndefined();
    });
  });

  describe('prefer @extend over @extends', () => {
    beforeEach(() => {
      app.state.conf = '@extend';
    });

    it('false if value already matches preferred style', () => {
      expect(extendTest('@extend $placeHolderconst')).toEqual(false);
    });

    it('true if value doesnt match preferred style', () => {
      expect(extendTest('@extends $placeHolderconst')).toBeDefined();
    });

    it('undefined if no extend on line', () => {
      expect(extendTest('$var = #fff')).toBeUndefined();
    });
  });
});
