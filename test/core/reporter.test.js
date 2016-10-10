'use strict';

const assert = require('assert');
const _ = require('lodash');
const stripColor = require('chalk').stripColor;
const reporter = require('../../src/core/reporter');

const countSeverities = require('../../src/utils/countSeveritiesInMessages');

function genMessage (filePath, ruleIds, severity) {
  ruleIds = Array.isArray(ruleIds) ? ruleIds : [ruleIds];

  return {
    filePath,
    messages: ruleIds.map(function (ruleId) {
      return {
        line: 1,
        column: -1,
        severity,
        message: 'This is not OK',
        source: '',
        ruleId,
      };
    }),
  };
}

function genWarning (filePath, rule) {
  return genMessage(filePath, rule, 'warning');
}

function genError (filePath, rule) {
  return genMessage(filePath, rule, 'error');
}

function generateReport (result) {
  const severities = countSeverities(_.flatMap(result, 'messages'));

  severities.results = result || [];

  return severities;
}

describe('reporter', function () {
  it('should have correct output on no message', function () {
    assert.equal(reporter(generateReport()), '');
  });

  it('should include kill message', function () {
    assert.equal(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), {}, true)), 'some file.styl\n1 no-undefined warning This is not OK\n\nStylint: 0 Errors.\nStylint: 1 Warnings.\nStylint: Over Error or Warning Limit.');
  });

  it('should include max errors and max warnings', function () {
    assert.equal(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), {
      maxErrors: 5,
      maxWarnings: 5,
    })), 'some file.styl\n1 no-undefined warning This is not OK\n\nStylint: 0 Errors. (Max Errors: 5)\nStylint: 1 Warnings. (Max Warnings: 5)');
  });

  it('should skip non-valid max errors and max warnings', function () {
    assert.equal(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), {
      maxErrors: -1,
      maxWarnings: 5,
    })), 'some file.styl\n1 no-undefined warning This is not OK\n\nStylint: 0 Errors.\nStylint: 1 Warnings. (Max Warnings: 5)');
    assert.equal(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), { maxWarnings: 5 })), 'some file.styl\n1 no-undefined warning This is not OK\n\nStylint: 0 Errors.\nStylint: 1 Warnings. (Max Warnings: 5)');
    assert.equal(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]), { maxErrors: 2 })), 'some file.styl\n1 no-undefined warning This is not OK\n\nStylint: 0 Errors. (Max Errors: 2)\nStylint: 1 Warnings.');
  });

  it('should format warning correctly', function () {
    assert.equal(stripColor(reporter(generateReport([genWarning('some file.styl', 'no-undefined')]))), 'some file.styl\n1 no-undefined warning This is not OK\n\nStylint: 0 Errors.\nStylint: 1 Warnings.');
  });

  it('should format error correctly', function () {
    assert.equal(stripColor(reporter(generateReport([genError('some file.styl', 'no-undefined')]))), 'some file.styl\n1 no-undefined error This is not OK\n\nStylint: 1 Errors.\nStylint: 0 Warnings.');
  });

  it('should format error and warning correctly', function () {
    const error = genError('some file.styl', 'no-undefined');
    const warning = genWarning('some file.styl', 'no-undefined');

    assert.equal(stripColor(reporter(generateReport([error, warning]))), 'some file.styl\n1 no-undefined error This is not OK\n\nsome file.styl\n1 no-undefined warning This is not OK\n\nStylint: 1 Errors.\nStylint: 1 Warnings.');
  });

  it('should format column', function () {
    const error = genError('some file.styl', 'no-undefined');

    error.messages[0].column = 5;

    assert.equal(stripColor(reporter(generateReport([error]))), 'some file.styl\n1:5 no-undefined error This is not OK\n\nStylint: 1 Errors.\nStylint: 0 Warnings.');
  });

  it('should not group files by default', function () {
    const error1 = genError('some file.styl', 'no-undefined');
    const error2 = genError('some file.styl', 'no-undefined');
    const error3 = genError('some other file.styl', 'no-undefined');

    assert.equal(stripColor(reporter(generateReport([error1, error2, error3]))), 'some file.styl\n1 no-undefined error This is not OK\n\nsome file.styl\n1 no-undefined error This is not OK\n\nsome other file.styl\n1 no-undefined error This is not OK\n\nStylint: 3 Errors.\nStylint: 0 Warnings.');
  });

  it('should group files correctly', function () {
    const error1 = genError('some file.styl', ['no-undefined', 'no-undefined']);
    const error2 = genError('some other file.styl', 'no-undefined');

    assert.equal(stripColor(reporter(generateReport([error1, error2]), { groupOutputByFile: true })), 'some file.styl\nFILE           LINEDATA SEVERITY MESSAGE        RULE        \nsome file.styl 1        error    This is not OK no-undefined\nsome file.styl 1        error    This is not OK no-undefined\n\nsome other file.styl\nFILE                 LINEDATA SEVERITY MESSAGE        RULE        \nsome other file.styl 1        error    This is not OK no-undefined\n\nStylint: 3 Errors.\nStylint: 0 Warnings.');
  });
});
