'use strict';

const _ = require('lodash');
const countSeverities = require('../../src/utils/countSeveritiesInMessages');

const generateMessage = (filePath, ruleIds, severity) => {
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
};

const generateWarning = (filePath, rule) => generateMessage(filePath, rule, 'warning');

const generateError = (filePath, rule) => generateMessage(filePath, rule, 'error');

const generateReport = result => {
  const severities = countSeverities(_.flatMap(result, 'messages'));

  severities.results = result || [];

  return severities;
};

module.exports = { generateMessage, generateWarning, generateError, generateReport };
