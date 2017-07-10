'use strict';

/**
 * @description Default formatter for stylint.
 * @param  {Object} report - Report object containing all results.
 * @param  {Object} [options] - Options provided to the formatter, and some relevant config.
 * @param  {boolean} [kill] - Whether or not we're over one of our limits.
 * @returns {string} The formatted message.
 */
const defaultFormatter = function(report, options, kill) {
  const results = report.results;

  if (results.length === 0) {
    return '';
  }

  const errorCount = report.errorCount;
  const maxErrors = options.maxErrors;
  const maxWarnings = options.maxWarnings;
  const warningCount = report.warningCount;

  let response = results.reduce((output, result) => {
    const filePath = result.filePath;
    const messages = result.messages;

    return output.concat(
      messages
        .map(msg => {
          const column = msg.column;
          const line = msg.line;
          const severity = msg.severity;
          const message = msg.message;

          const lineData = column ? `${line}:${column}` : line;

          return `${severity}: ${message}\nFile: ${filePath}\nLine: ${lineData}`;
        })
        .join('\n')
    );
  }, '');

  response += `\n\nStylint: ${errorCount} Errors.`;
  response += maxErrors ? ` (Max Errors: ${maxErrors})` : '';
  response += `\nStylint: ${warningCount} Warnings.`;
  response += maxWarnings ? ` (Max Warnings: ${maxWarnings})` : '';
  response += kill ? '\nStylint: Over Error or Warning Limit.' : '';
  return response;
};

module.exports = defaultFormatter;
