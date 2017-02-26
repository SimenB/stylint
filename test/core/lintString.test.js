'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe('Lint Text: ', () => {
  let linter;

  beforeEach(() => {
    linter = stylint.api();
  });

  it('should return object with violations', () => {
    expect(linter.lintString('.class {\n  color: red !important\n}\n', null, 'filename.styl')).toMatchSnapshot();
  });
});
