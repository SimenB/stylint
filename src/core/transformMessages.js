'use strict';

const _ = require('lodash');

const countSeverities = require('../utils/countSeveritiesInMessages');

/**
 * @description Transforms all messages into the format returned to the caller, or passed to reporters.
 * @param {boolean} [skipDone] - If true, don't call done.
 * @returns {Object} Returns the transformed object.
 */
const transformMessages = function (skipDone) {
  const severities = countSeverities(this.cache.messages);
  const errorCount = severities.errorCount;
  const warningCount = severities.warningCount;

  const groupedByFile = _.chain(this.cache.messages)
    .groupBy('file')
    .map((messages, filePath) => {
      const localSeverities = countSeverities(messages);

      // Just removes `file`
      const filteredMessages = messages.map(message => ({
        column: message.column,
        line: message.line,
        message: message.message,
        source: message.source,
        ruleId: message.ruleId,
        severity: message.severity,
      }));

      return {
        filePath,
        messages: filteredMessages,
        errorCount: localSeverities.errorCount,
        warningCount: localSeverities.warningCount,
      };
    })
    .value();

  const report = {
    results: groupedByFile,
    errorCount,
    warningCount,
  };

  this.cache.report = report;

  if (!skipDone) {
    this.done();
  }

  return report;
};

module.exports = transformMessages;
