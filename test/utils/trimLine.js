'use strict';

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
    expect(trimTest('.noCommentOnThisLine ')).toEqual('.noCommentOnThisLine ');
  });

  it('do nothing if comment is 1st character', () => {
    expect(trimTest('// .noCommentOnThisLine ')).toEqual(
      '// .noCommentOnThisLine '
    );
  });

  it('trim comment if not first character', () => {
    expect(trimTest('.noCommentOnThisLine //')).toEqual('.noCommentOnThisLine');
  });

  it('trim interpolated variables', () => {
    expect(trimTest('.test-{interpolation}')).toEqual('.test-');
  });
});
