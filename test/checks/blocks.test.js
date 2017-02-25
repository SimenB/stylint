'use strict';

const assert = require('assert');
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
      assert.equal(false, blockTest('myBlock = '));
      assert.equal(false, blockTest('myBlock ='));
    });

    it('true if block style correct', () => {
      assert.ok(blockTest('myBlock = @block'));
      assert.ok(blockTest('myBlock = @block '));
    });

    it('undefined if block style not applicable', () => {
      assert.equal(undefined, blockTest('.class'));
    });
  });

  describe('disallow @block when defining block vars', () => {
    beforeEach(() => {
      app.state.conf = 'never';
    });

    it('false if block style IS correct', () => {
      assert.equal(false, blockTest('myBlock = '));
      assert.equal(false, blockTest('myBlock ='));
    });

    it('true if block style NOT correct', () => {
      assert.ok(blockTest('myBlock = @block'));
      assert.ok(blockTest('myBlock = @block '));
    });

    it('undefined if block style not applicable', () => {
      assert.equal(undefined, blockTest('.class'));
      assert.equal(undefined, blockTest('input[type="submit"]'));
    });
  });
});
