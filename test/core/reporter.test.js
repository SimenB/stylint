'use strict';

const _ = require('lodash');
const stripColor = require('chalk').stripColor;
const sinon = require('sinon');
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
    expect(reporter(generateReport()), '');
  });

  it('should include kill message', () => {
    expect(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), {}, true)))
      .toEqual(
        'some file.styl\n1 no-undefined warning This is not OK' +
        '\n\nStylint: 0 Errors.\nStylint: 1 Warnings.\nStylint: Over Error or Warning Limit.'
      );
  });

  it('should include max errors and max warnings', () => {
    expect(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), {
      maxErrors: 5,
      maxWarnings: 5,
    }))).toEqual(
      'some file.styl\n1 no-undefined warning This is not OK' +
      '\n\nStylint: 0 Errors. (Max Errors: 5)\nStylint: 1 Warnings. (Max Warnings: 5)'
    );
  });

  it('should skip non-valid max errors and max warnings', () => {
    expect(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), {
      maxErrors: -1,
      maxWarnings: 5,
    }))).toEqual(
      'some file.styl\n1 no-undefined warning This is not OK\n\nStylint: 0 Errors.\nStylint: 1 Warnings. (Max Warnings: 5)'
    );
    expect(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), { maxWarnings: 5 }))).toEqual(
      'some file.styl\n1 no-undefined warning This is not OK\n\nStylint: 0 Errors.\nStylint: 1 Warnings. (Max Warnings: 5)'
    );
    expect(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), { maxErrors: 2 }))).toEqual(
      'some file.styl\n1 no-undefined warning This is not OK\n\nStylint: 0 Errors. (Max Errors: 2)\nStylint: 1 Warnings.'
    );
  });

  it('should format warning correctly', () => {
    expect(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')])))).toEqual(
      'some file.styl\n1 no-undefined warning This is not OK\n\nStylint: 0 Errors.\nStylint: 1 Warnings.'
    );
  });

  it('should format error correctly', () => {
    expect(stripColor(reporter(generateReport([genError('some file.styl', 'no-undefined')])))).toEqual(
      'some file.styl\n1 no-undefined error This is not OK\n\nStylint: 1 Errors.\nStylint: 0 Warnings.'
    );
  });

  it('should format error and warning correctly', () => {
    const error = genError('some file.styl', 'no-undefined');
    const warning = genWarning('some file.styl', 'no-undefined');

    expect(stripColor(reporter(generateReport([error, warning])))).toEqual(
      'some file.styl\n1 no-undefined error This is not OK\n\nsome file.styl\n1 no-undefined warning This is not OK' +
      '\n\nStylint: 1 Errors.\nStylint: 1 Warnings.'
    );
  });

  it('should format column', () => {
    const error = genError('some file.styl', 'no-undefined');

    error.messages[0].column = 5;

    expect(stripColor(reporter(generateReport([error])))).toEqual(
      'some file.styl\n1:5 no-undefined error This is not OK\n\nStylint: 1 Errors.\nStylint: 0 Warnings.'
    );
  });

  it('should not group files by default', () => {
    const error1 = genError('some file.styl', 'no-undefined');
    const error2 = genError('some file.styl', 'no-undefined');
    const error3 = genError('some other file.styl', 'no-undefined');

    expect(stripColor(reporter(generateReport([error1, error2, error3])))).toEqual(
      'some file.styl\n1 no-undefined error This is not OK\n\nsome file.styl\n1 no-undefined error This is not OK' +
      '\n\nsome other file.styl\n1 no-undefined error This is not OK\n\nStylint: 3 Errors.\nStylint: 0 Warnings.'
    );
  });

  it('should group files correctly', () => {
    const error1 = genError('some file.styl', ['no-undefined', 'no-undefined']);
    const error2 = genError('some other file.styl', 'no-undefined');

    expect(stripColor(reporter(generateReport([error1, error2]), { groupOutputByFile: true }))).toEqual(
      'some file.styl\nFILE           LINEDATA SEVERITY MESSAGE        RULE        \nsome file.styl 1        error    This is not OK ' +
      'no-undefined\nsome file.styl 1        error    This is not OK no-undefined\n\nsome other file.styl' +
      '\nFILE                 LINEDATA SEVERITY MESSAGE        RULE        \nsome other file.styl 1        error    This is not OK ' +
      'no-undefined\n\nStylint: 3 Errors.\nStylint: 0 Warnings.'
    );
  });
});

describe('(Old tests) Reporter should: ', () => {
  const app = stylint().create();

  beforeEach(() => {
    sinon.spy(app, 'reporter');
  });

  afterEach(() => {
    app.reporter.restore();
  });

  it('return correctly formatted msg', () => {
    app.cache.rule = 'universal';
    const expectedOutput = 'testReporter\n1 universal warning universal disallowed\n\nStylint: 0 Errors.\nStylint: 1 Warnings.';

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

    expect(stripColor(app.reporter({
      results: [msg],
      errorCount: 0,
      warningCount: 1,
    }))).toEqual(expectedOutput);
  });
});
