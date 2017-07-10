'use strict';

const defaultFormatter = require('../../src/formatters/default');

describe('defaultFormatter', () => {
  let returnValue;

  describe('when an empty report is passed in', () => {
    beforeEach(() => {
      returnValue = defaultFormatter();
    });

    it('should return an empty string', () => {
      expect(returnValue).toBe('');
    });
  });

  describe('when kill is passed in', () => {
    beforeEach(() => {
      returnValue = defaultFormatter();
    });

    it('should append the report with a warning message', () => {
      expect(returnValue).toMatch(/Stylint: Over Error or Warning Limit./);
    });
  });

  describe('when max errors are passed in', () => {
    beforeEach(() => {
      returnValue = defaultFormatter();
    });

    it('should include the max error count in the report', () => {
      expect(returnValue).toMatch(/\(Max Errors: \d+ \)/);
    });
  });

  describe('when max warnings are passed in', () => {
    beforeEach(() => {
      returnValue = defaultFormatter();
    });

    it('should include the max warning count in the report', () => {
      expect(returnValue).toMatch(/\(Max Warnings: \d+ \)/);
    });
  });

  describe('when an empty report is passed in', () => {
    beforeEach(() => {
      returnValue = defaultFormatter();
    });

    it('should return an empty string', () => {
      expect(returnValue).toBe('');
    });
  });
});
