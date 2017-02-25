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
    const lintResult = linter.lintString('.class {\n  color: red !important\n}\n', null, 'filename.styl');

    expect({
      results: [{
        filePath: 'filename.styl',
        messages: [{
          column: 13,
          line: 2,
          message: '!important is disallowed',
          source: '  color: red !important',
          ruleId: 'noImportant',
          severity: 'warning',
        }, {
          column: 23,
          line: 2,
          message: 'missing semicolon',
          source: '  color: red !important',
          ruleId: 'semicolons',
          severity: 'warning',
        }],
        errorCount: 0,
        warningCount: 2,
      }],
      errorCount: 0,
      warningCount: 2,
    }).toEqual(lintResult);
  });
});
