'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

const commentSpaceTest = app.lintMethods.commentSpace.bind(app);

describe('comment space', () => {
  afterEach(() => {
    app.cache.messages = [];
  });

  describe('prefer spaces after line comments', () => {
    beforeEach(() => {
      app.state.hasComment = true;
    });

    it('false if line comment doesnt have a space after it', () => {
      app.cache.comment = '//test';
      expect(commentSpaceTest('', '')).toEqual(false);
    });

    it('true if line comment has space after it', () => {
      app.cache.comment = '// test';
      expect(commentSpaceTest('', '')).toBeDefined();
    });

    it('undefined if line has no comment', () => {
      app.state.hasComment = false;
      expect(commentSpaceTest('', '.test')).toBeUndefined();
    });
  });

  describe('prefer NO spaces after line comments', () => {
    beforeEach(() => {
      app.state.hasComment = true;
      app.state.conf = 'never';
    });

    it('false if line comment doesnt have a space after it', () => {
      app.cache.comment = '//test';
      expect(commentSpaceTest('', '')).toEqual(false);
    });

    it('true if line comment has space after it', () => {
      app.cache.comment = '// test';
      expect(commentSpaceTest('', '')).toBeDefined();
    });

    it('undefined if line has no comment', () => {
      app.state.hasComment = false;
      expect(commentSpaceTest('', '.test')).toBeUndefined();
    });
  });
});
