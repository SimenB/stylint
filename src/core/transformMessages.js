'use strict';

var _ = require('lodash');

var countSeverities = require('../utils/countSeveritiesInMessages');

/**
 * @description transforms all messages into the format returned to the caller, or passed to reporters
 * @param {boolean} [skipDone] if true, don't call done
 * @returns {Object} returns the transformed object
 */
var transformMessages = function (skipDone) {
  var severities = countSeverities(this.cache.messages);
  var errorCount = severities.errorCount;
  var warningCount = severities.warningCount;

  var groupedByFile = _.chain(this.cache.messages)
		.groupBy('file')
		.map(function (messages, filePath) {
  var localSeverities = countSeverities(messages);

  var filteredMessages = messages.map(function (message) {
				// Just removes `file`
    return {
      column: message.column,
      line: message.line,
      message: message.message,
      source: message.source,
      ruleId: message.ruleId,
      severity: message.severity
    };
  });

  return {
    filePath: filePath,
    messages: filteredMessages,
    errorCount: localSeverities.errorCount,
    warningCount: localSeverities.warningCount
  };
})
		.value();

  var report = {
    results: groupedByFile,
    errorCount: errorCount,
    warningCount: warningCount
  };

  this.cache.report = report;

  if (!skipDone) {
    this.done();
  }

  return report;
};

module.exports = transformMessages;
