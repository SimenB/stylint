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
  if (report.results.length === 0) return '';

  const {results, errorCount, maxErrors, maxWarnings, warningCount} = report;

  if (errorCount === 0 && warningCount === 0) return '';

  let formattedMessages = results.map(result => {
    const {filePath, messages} = result;

    newMessages = messages.map(msg => {
      const {column, line, ruleId, severity} = msg;
      const lineData = column ? `${line}:${column}` : line;

      const newMessage = `${severity}: ${msg}
      File: ${filePath}
      Line: ${lineData}`;

      return _.set(msg, 'message', newMessage);
    })

    return _.set(result, newMessages);
  });

  response = `Stylint: ${errorCount} Errors.`;
  response += maxErrors ? ` (Max Errors: ${maxErrors} )` : '';
  response += `\nStylint: ${warningCount} Warnings.`;
  response += maxWarnings ? ` (Max Warnings: ${maxWarnings} )` : '';

  response += kill ? '\nStylint: Over Error or Warning Limit.' : '';

  return `${formattedMessages}\n\n${response}`;
}

module.exports = defaultFormatter;
