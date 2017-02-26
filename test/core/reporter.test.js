'use strict';

const _ = require('lodash');
const reporter = require('../../src/core/reporter');

const countSeverities = require('../../src/utils/countSeveritiesInMessages');

const stylint = require('../../index');

function genMessage(filePath, ruleIds, severity) {
  const ruleIdsArray = Array.isArray(ruleIds) ? ruleIds : [ruleIds];

  return {
    filePath,
    messages: ruleIdsArray.map(ruleId => ({
      line: 1,
      column: -1,
      severity,
      message: 'This is not OK',
      source: '',
      ruleId,
    })),
  };
}

function genWarning(filePath, rule) {
  return genMessage(filePath, rule, 'warning');
}

function genError(filePath, rule) {
  return genMessage(filePath, rule, 'error');
}

function generateReport(result) {
  const severities = countSeverities(_.flatMap(result, 'messages'));

  severities.results = result || [];

  return severities;
}

describe('reporter', () => {
  it('should have correct output on no message', () => {
    expect(reporter(generateReport())).toMatchSnapshot();
  });

  it('should include kill message', () => {
    expect(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), {}, true)).toMatchSnapshot();
  });

  it('should include max errors and max warnings', () => {
    expect(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), { maxErrors: 5, maxWarnings: 5 })).toMatchSnapshot();
  });

  it('should skip non-valid max errors and max warnings', () => {
    expect(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), { maxErrors: -1, maxWarnings: 5 })).toMatchSnapshot();
    expect(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), { maxWarnings: 5 })).toMatchSnapshot();
    expect(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), { maxErrors: 2 })).toMatchSnapshot();
  });

  it('should format warning correctly', () => {
    expect(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]))).toMatchSnapshot();
  });

  it('should format error correctly', () => {
    expect(reporter(generateReport([genError('some file.styl', 'no-undefined')]))).toMatchSnapshot();
  });

  it('should format error and warning correctly', () => {
    const error = genError('some file.styl', 'no-undefined');
    const warning = genWarning('some file.styl', 'no-undefined');

    expect(reporter(generateReport([error, warning]))).toMatchSnapshot();
  });

  it('should format column', () => {
    const error = genError('some file.styl', 'no-undefined');

    error.messages[0].column = 5;

    expect(reporter(generateReport([error]))).toMatchSnapshot();
  });

  it('should not group files by default', () => {
    const error1 = genError('some file.styl', 'no-undefined');
    const error2 = genError('some file.styl', 'no-undefined');
    const error3 = genError('some other file.styl', 'no-undefined');

    expect(reporter(generateReport([error1, error2, error3]))).toMatchSnapshot();
  });

  it('should group files correctly', () => {
    const error1 = genError('some file.styl', ['no-undefined', 'no-undefined']);
    const error2 = genError('some other file.styl', 'no-undefined');

    expect(reporter(generateReport([error1, error2]), { groupOutputByFile: true })).toMatchSnapshot();
  });
});

describe('(Old tests) Reporter should: ', () => {
  const app = stylint().create();

  it('return correctly formatted msg', () => {
    app.cache.rule = 'universal';

    const msg = {
      filePath: 'testReporter',
      messages: [{
        message: 'universal disallowed',
        severity: 'warning',
        line: 1,
        column: 0,
        ruleId: 'universal',
        source: 'Reporter Lyfe*',
      }],
    };

    expect(app.reporter({ results: [msg], errorCount: 0, warningCount: 1 })).toMatchSnapshot();
  });
});
