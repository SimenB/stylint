'use strict';

const assert = require('assert');
const countSeverities = require('../../src/utils/countSeveritiesInMessages');

describe('countSeveritiesInMessages', () => {
  it('should count warning correctly', () => {
    assert.deepEqual(countSeverities([{ severity: 'warning' }]), { errorCount: 0, warningCount: 1 });
  });

  it('should count error correctly', () => {
    assert.deepEqual(countSeverities([{ severity: 'error' }]), { errorCount: 1, warningCount: 0 });
  });

  it('should count both error and warning correctly', () => {
    assert.deepEqual(countSeverities([{ severity: 'error' }, { severity: 'warning' }]), { errorCount: 1, warningCount: 1 });
  });

  it('should handle empty array', () => {
    assert.deepEqual(countSeverities([]), { errorCount: 0, warningCount: 0 });
  });

  it('should handle no arguments', () => {
    assert.deepEqual(countSeverities(), { errorCount: 0, warningCount: 0 });
  });
});
