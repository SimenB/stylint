'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var columnify = require('columnify');

/**
 * @description format output message for console (default)
 * @param  {Object} report  report object containing all results
 * @param  {Object} [options] options provided to the reporter, and some relevant config
 * @param  {boolean} [kill] whether or not we're over one of our limits
 * @return {string} the formatted message
 */
var reporter = function (report, options, kill) {
  if (report.results.length === 0) {
    return '';
  }

  options = options || {};
  var formattedMessages = _.chain(report.results)
		.map(function (result) {
  var newResult = result;
  var file = chalk.underline(result.filePath);

  newResult.messages = result.messages.map(function (msg) {
    var column = typeof msg.column === 'number' && msg.column > 0 ? msg.column : null;
    var lineData = column ? msg.line + ':' + column : msg.line;

    var severity = msg.severity;
    severity = severity === 'warning' ?
					chalk.yellow(severity) :
					chalk.red(severity);

    var rule = chalk.grey(msg.ruleId);

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

  var formattedMessage = 'Stylint: ' + report.errorCount + ' Errors.';
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
