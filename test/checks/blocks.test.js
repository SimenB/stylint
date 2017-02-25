'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;
app.state.strictMode = true;

const blockTest = app.lintMethods.blocks.bind(app);

describe('blocks', () => {
  beforeEach(() => {
    app.state.conf = 'always';
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  describe('prefer @block when defining block vars', () => {
    it('false if block style incorrect', () => {
      expect(blockTest('myBlock = ')).toEqual(false);
      expect(blockTest('myBlock =')).toEqual(false);
    });

    it('true if block style correct', () => {
      expect(blockTest('myBlock = @block')).toEqual(true);
      expect(blockTest('myBlock = @block ')).toEqual(true);
    });

    it('undefined if block style not applicable', () => {
      expect(blockTest('.class')).toBeUndefined();
    });
  });

  describe('disallow @block when defining block vars', () => {
    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if block style IS correct', () => {
      expect(blockTest('myBlock = ')).toEqual(false);
      expect(blockTest('myBlock =')).toEqual(false);
    });

    it('true if block style NOT correct', () => {
      expect(blockTest('myBlock = @block')).toEqual(true);
      expect(blockTest('myBlock = @block ')).toEqual(true);
    });

    it('undefined if block style not applicable', () => {
      expect(blockTest('.class')).toBeUndefined();
      expect(blockTest('input[type="submit"]')).toBeUndefined();
    });
  });
});
