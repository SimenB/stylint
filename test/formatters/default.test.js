'use strict';

const defaultFormatter = require('../../src/formatters/default');
const formatterMockUtils = require('../../src/utils/formatterMockUtils');

const MOCK_FILE_NAME = 'some file.styl';
const MOCK_RULE_ID = 'duplicates';

describe('defaultFormatter', () => {
  let returnValue;
  const report = formatterMockUtils.generateReport([
    formatterMockUtils.generateWarning(MOCK_FILE_NAME, MOCK_RULE_ID),
  ]);
  const cleanReport = formatterMockUtils.generateReport();

  describe('when the report has no results', () => {
    beforeEach(() => {
      returnValue = defaultFormatter(cleanReport);
    });

    it('should return an empty string', () => {
      expect(returnValue).toBe('');
    });
  });

  describe('when kill is passed in', () => {
    beforeEach(() => {
      returnValue = defaultFormatter(report, {}, true);
    });

    it('should append the report with a warning message', () => {
      expect(returnValue).toMatchSnapshot();
    });
  });

  describe('when max errors or max warnings is 0 or greater', () => {
    beforeEach(() => {
      returnValue = defaultFormatter(report, { maxErrors: 5, maxWarnings: 2 });
    });

    it('should include the max warning and error counts in the report', () => {
      expect(returnValue).toMatchSnapshot();
    });
  });

  describe('when max error or max warning is less than 0', () => {
    beforeEach(() => {
      returnValue = defaultFormatter(report, {
        maxErrors: -1,
        maxWarnings: -1,
      });
    });

    it('should not include the max warning and error counts in the report', () => {
      expect(returnValue).toMatchSnapshot();
    });
  });

  describe('when a message does not include a column', () => {
    beforeEach(() => {
      const noColumnReport = formatterMockUtils.generateReport([
        formatterMockUtils.generateWarning(MOCK_FILE_NAME, MOCK_RULE_ID),
      ]);
      // TODO - This is better encapsulated if it is a part of generateReport.
      noColumnReport.results[0].messages[0].column = null;

      returnValue = defaultFormatter(noColumnReport, {});
    });

    it('should only display the line number for each message', () => {
      expect(returnValue).toMatchSnapshot();
    });
  });
});
