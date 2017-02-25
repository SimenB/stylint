'use strict';

const countSeverities = require('../../src/utils/countSeveritiesInMessages');

describe('countSeveritiesInMessages', () => {
  it('should count warning correctly', () => {
    expect(countSeverities([{ severity: 'warning' }])).toEqual({ errorCount: 0, warningCount: 1 });
  });

  it('should count error correctly', () => {
    expect(countSeverities([{ severity: 'error' }])).toEqual({ errorCount: 1, warningCount: 0 });
  });

  it('should count both error and warning correctly', () => {
    expect(countSeverities([{ severity: 'error' }, { severity: 'warning' }])).toEqual({ errorCount: 1, warningCount: 1 });
  });

  it('should handle empty array', () => {
    expect(countSeverities([])).toEqual({ errorCount: 0, warningCount: 0 });
  });

  it('should handle no arguments', () => {
    expect(countSeverities()).toEqual({ errorCount: 0, warningCount: 0 });
  });
});
