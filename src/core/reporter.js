'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const columnify = require('columnify');

/**
 * @description format output message for console (default)
 * @param  {Object} report  report object containing all results
 * @param  {Object} [options] options provided to the reporter, and some relevant config
 * @param  {boolean} [kill] whether or not we're over one of our limits
 * @return {string} the formatted message
 */
const reporter = function (report, options, kill) {
  if (report.results.length === 0) {
    return '';
  }

  options = options || {};
  let formattedMessages = _.chain(report.results)
		.map(function (result) {
  const newResult = result;
  const file = chalk.underline(result.filePath);

  newResult.messages = result.messages.map(function (msg) {
    const column = typeof msg.column === 'number' && msg.column > 0 ? msg.column : null;
    const lineData = column ? msg.line + ':' + column : msg.line;

    let severity = msg.severity;
    severity = severity === 'warning' ?
					chalk.yellow(severity) :
					chalk.red(severity);

    const rule = chalk.grey(msg.ruleId);

    return {
      file: file,
      lineData: lineData,
      severity: severity,
      message: msg.message,
      rule: rule
    };
  });

  return newResult;
});

  if (options.groupOutputByFile) {
		// iterate over arrays of message objects
		// each array consists of all the errors and warnings for a file
		// columnify the errors/warnings and prefix them with the file name
    formattedMessages = formattedMessages
			.map(function (results) {
  return results.filePath + '\n' + columnify(results.messages, options.reporterOptions);
});
  }
  else {
    formattedMessages = formattedMessages
		.flatMap('messages')
		.map(function (output) {
  return output.file + '\n' + output.lineData + ' ' + output.rule + ' ' + output.severity + ' ' + output.message;
});
  }

  formattedMessages = formattedMessages.reduce(function (memo, msg) {
    return memo + msg + '\n\n';
  }, '')
		.value()
		.trim();

  let formattedMessage = 'Stylint: ' + report.errorCount + ' Errors.';
  formattedMessage += options.maxErrors >= 0 ? ' (Max Errors: ' + options.maxErrors + ')' : '';

  formattedMessage += '\nStylint: ' + report.warningCount + ' Warnings.';
  formattedMessage += options.maxWarnings >= 0 ? ' (Max Warnings: ' + options.maxWarnings + ')' : '';

	// if you set a max it kills the linter
  if (kill) {
    formattedMessage += '\nStylint: Over Error or Warning Limit.';
  }

  return (formattedMessages + '\n\n' + formattedMessage).trim();
};

module.exports = reporter;
