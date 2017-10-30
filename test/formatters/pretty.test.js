'use strict';

const prettyFormatter = require('../../src/formatters/pretty');
const formatterMockUtils = require('../../src/utils/formatterMockUtils');

describe('prettyFormatter', () => {
  it('should have correct output on no message', () => {
    expect(
      prettyFormatter(formatterMockUtils.generateReport())
    ).toMatchSnapshot();
  });

  it('should include kill message', () => {
    const report = formatterMockUtils.generateReport([
      formatterMockUtils.generateWarning('some file.styl', 'no-undefined'),
    ]);

    expect(prettyFormatter(report, {}, true)).toMatchSnapshot();
  });

  it('should include max errors and max warnings', () => {
    const report = formatterMockUtils.generateReport([
      formatterMockUtils.generateWarning('some file.styl', 'no-undefined'),
    ]);

    expect(
      prettyFormatter(report, { maxErrors: 5, maxWarnings: 5 })
    ).toMatchSnapshot();
  });

  it('should skip non-valid max errors and max warnings', () => {
    const negativeErrorReport = formatterMockUtils.generateReport([
      formatterMockUtils.generateWarning('some file.styl', 'no-undefined'),
    ]);
    const negativeErrorOptions = { maxErrors: -1, maxWarnings: 5 };

    const missingErrorReport = formatterMockUtils.generateReport([
      formatterMockUtils.generateWarning('some file.styl', 'no-undefined'),
    ]);
    const missingErrorOptions = { maxWarnings: 5 };

    const missingWarningReport = formatterMockUtils.generateReport([
      formatterMockUtils.generateWarning('some file.styl', 'no-undefined'),
    ]);
    const missingWarningOptions = { maxErrors: 2 };

    expect(
      prettyFormatter(negativeErrorReport, negativeErrorOptions)
    ).toMatchSnapshot();
    expect(
      prettyFormatter(missingErrorReport, missingErrorOptions)
    ).toMatchSnapshot();
    expect(
      prettyFormatter(missingWarningReport, missingWarningOptions)
    ).toMatchSnapshot();
  });

  it('should format warning correctly', () => {
    const report = formatterMockUtils.generateReport([
      formatterMockUtils.generateWarning('some file.styl', 'no-undefined'),
    ]);

    expect(prettyFormatter(report)).toMatchSnapshot();
  });

  it('should format error correctly', () => {
    const report = formatterMockUtils.generateReport([
      formatterMockUtils.generateError('some file.styl', 'no-undefined'),
    ]);

    expect(prettyFormatter(report)).toMatchSnapshot();
  });

  it('should format error and warning correctly', () => {
    const error = formatterMockUtils.generateError(
      'some file.styl',
      'no-undefined'
    );
    const warning = formatterMockUtils.generateWarning(
      'some file.styl',
      'no-undefined'
    );

    expect(
      prettyFormatter(formatterMockUtils.generateReport([error, warning]))
    ).toMatchSnapshot();
  });

  it('should format column', () => {
    const error = formatterMockUtils.generateError(
      'some file.styl',
      'no-undefined'
    );

    error.messages[0].column = 5;

    expect(
      prettyFormatter(formatterMockUtils.generateReport([error]))
    ).toMatchSnapshot();
  });

  it('should not group files by default', () => {
    const error1 = formatterMockUtils.generateError(
      'some file.styl',
      'no-undefined'
    );
    const error2 = formatterMockUtils.generateError(
      'some file.styl',
      'no-undefined'
    );
    const error3 = formatterMockUtils.generateError(
      'some other file.styl',
      'no-undefined'
    );
    const report = formatterMockUtils.generateReport([error1, error2, error3]);

    expect(prettyFormatter(report)).toMatchSnapshot();
  });

  it('should group files correctly', () => {
    const error1 = formatterMockUtils.generateError('some file.styl', [
      'no-undefined',
      'no-undefined',
    ]);
    const error2 = formatterMockUtils.generateError(
      'some other file.styl',
      'no-undefined'
    );
    const options = { groupOutputByFile: true };
    const report = formatterMockUtils.generateReport([error1, error2]);

    expect(prettyFormatter(report, options)).toMatchSnapshot();
  });
});
