'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe('trim line should: ', () => {
  let trimTest;
  beforeEach(() => {
    trimTest = app.trimLine.bind(app);
  });

  it('do nothing if line has no comment', () => {
    assert.equal('.noCommentOnThisLine ', trimTest('.noCommentOnThisLine '));
  });

  it('do nothing if comment is 1st character', () => {
    assert.equal('// .noCommentOnThisLine ', trimTest('// .noCommentOnThisLine '));
  });

  it('trim comment if not first character', () => {
    assert.equal('.noCommentOnThisLine', trimTest('.noCommentOnThisLine //'));
  });

  it('trim interpolated variables', () => {
    assert.equal('.test-', trimTest('.test-{interpolation}'));
  });
});
