'use strict';

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
    beforeAll(() => {
      app.state.conf = 'never';
    });

    it('false (no err) if border 0', () => {
      expect(noneTest('border 0')).toEqual(false);
      expect(noneTest('border: 0')).toEqual(false);
      expect(noneTest('border:0')).toEqual(false);
      expect(noneTest('border 1px solid red')).toEqual(false);
    });

    it('false (no err) if outline 0', () => {
      expect(noneTest('outline 0')).toEqual(false);
      expect(noneTest('outline: 0')).toEqual(false);
      expect(noneTest('outline:0')).toEqual(false);
      expect(noneTest('outline 1px solid red')).toEqual(false);
    });

    it('true (err found) if border none', () => {
      expect(noneTest('border none')).toBeDefined();
      expect(noneTest('border: none')).toBeDefined();
      expect(noneTest('border:none')).toBeDefined();
    });

    it('true (err found) if outline none', () => {
      expect(noneTest('outline none')).toBeDefined();
      expect(noneTest('outline: none')).toBeDefined();
      expect(noneTest('outline:none')).toBeDefined();
    });

    it('undefined if border or outline not on line', () => {
      expect(noneTest('margin 0')).toBeUndefined();
      expect(noneTest('padding inherit')).toBeUndefined();
    });
  });

  describe('prefer none over 0', () => {
    beforeAll(() => {
      app.state.conf = 'always';
    });

    it('false (no err) if border none', () => {
      expect(!noneTest('border none')).toBeDefined();
      expect(!noneTest('border: none')).toBeDefined();
      expect(!noneTest('border:none')).toBeDefined();
      expect(!noneTest('border 1px solid red')).toBeDefined();
    });

    it('false (no err) if outline none', () => {
      expect(!noneTest('outline none')).toBeDefined();
      expect(!noneTest('outline: none')).toBeDefined();
      expect(!noneTest('outline:none')).toBeDefined();
      expect(!noneTest('outline 1px solid red')).toBeDefined();
    });

    it('true (err) if border 0 or not applicable', () => {
      expect(noneTest('border 0')).toBeDefined();
      expect(noneTest('border: 0')).toBeDefined();
      expect(noneTest('border:0')).toBeDefined();
    });

    it('true (err) if outline 0 or not applicable', () => {
      expect(noneTest('outline 0')).toBeDefined();
      expect(noneTest('outline: 0')).toBeDefined();
      expect(noneTest('outline:0')).toBeDefined();
    });

    it('undefined if border or outline not on line', () => {
      expect(noneTest('margin 0')).toBeUndefined();
      expect(noneTest('padding inherit')).toBeUndefined();
    });
  });
});
