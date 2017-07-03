'use strict';

const _ = require('lodash');

/**
 * @description Default formatter for stylint.
 * @param  {Object} report - Report object containing all results.
 * @param  {Object} [options] - Options provided to the reporter, and some relevant config.
 * @param  {boolean} [kill] - Whether or not we're over one of our limits.
 * @returns {string} The formatted message.
 */
const defaultFormatter = function(report, options, kill) {
  const results = report.results;

  if (results.length === 0) {
    return '';
  }

  const errorCount = report.errorCount;
  const warningCount = report.warningCount;

  if (errorCount === 0 && warningCount === 0) {
    return '';
  }

  const maxErrors = report.maxErrors;
  const maxWarnings = report.maxWarnings;

  const formattedMessages = report.results.map(result => {
    const filePath = result.filePath;
    const messages = result.messages;

    const newMessages = messages.map(msg => {
      const column = msg.column;
      const line = msg.line;
      const severity = msg.severity;

      const lineData = column ? `${line}:${column}` : line;

      const newMessage = `${severity}: ${msg}
        File: ${filePath}
        Line: ${lineData}`;

      return _.set(msg, 'message', newMessage);
    });

    return _.set(result, newMessages);
  });

  let response = `Stylint: ${errorCount} Errors.`;
  response += maxErrors ? ` (Max Errors: ${maxErrors} )` : '';
  response += `\nStylint: ${warningCount} Warnings.`;
  response += maxWarnings ? ` (Max Warnings: ${maxWarnings} )` : '';

  response += kill ? '\nStylint: Over Error or Warning Limit.' : '';

  return `${formattedMessages}\n\n${response}`;
};

module.exports = defaultFormatter;
