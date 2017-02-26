'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const columnify = require('columnify');

/**
 * @description Format output message for console (default).
 * @param  {Object} report - Report object containing all results.
 * @param  {Object} [options] - Options provided to the reporter, and some relevant config.
 * @param  {boolean} [kill] - Whether or not we're over one of our limits.
 * @returns {string} The formatted message.
 */
const reporter = function (report, options, kill) {
  if (report.results.length === 0) {
    return '';
  }

  const existingOptions = options || {};
  let formattedMessages = _.chain(report.results)
    .map(result => {
      const newResult = result;
      const file = chalk.underline(result.filePath);

      newResult.messages = result.messages.map(msg => {
        const column = typeof msg.column === 'number' && msg.column > 0 ? msg.column : null;
        const lineData = column ? `${msg.line}:${column}` : msg.line;

        let severity = msg.severity;
        severity = severity === 'warning' ?
          chalk.yellow(severity) :
          chalk.red(severity);

        const rule = chalk.grey(msg.ruleId);

        return {
          file,
          lineData,
          severity,
          message: msg.message,
          rule,
        };
      });

      return newResult;
    });

  if (existingOptions.groupOutputByFile) {
    // iterate over arrays of message objects
    // each array consists of all the errors and warnings for a file
    // columnify the errors/warnings and prefix them with the file name
    formattedMessages = formattedMessages
      .map(results => `${results.filePath}\n${columnify(results.messages, existingOptions.reporterOptions)}`);
  }
  else {
    formattedMessages = formattedMessages
      .flatMap('messages')
      .map(output => `${output.file}\n${output.lineData} ${output.rule} ${output.severity} ${output.message}`);
  }

  formattedMessages = formattedMessages.join('\n\n').value();

  let formattedMessage = `Stylint: ${report.errorCount} Errors.`;
  formattedMessage += existingOptions.maxErrors >= 0 ? ` (Max Errors: ${existingOptions.maxErrors})` : '';

  formattedMessage += `\nStylint: ${report.warningCount} Warnings.`;
  formattedMessage += existingOptions.maxWarnings >= 0 ? ` (Max Warnings: ${existingOptions.maxWarnings})` : '';

  // if you set a max it kills the linter
  if (kill) {
    formattedMessage += '\nStylint: Over Error or Warning Limit.';
  }

  return `${formattedMessages}\n\n${formattedMessage}`.trim();
};

module.exports = reporter;
