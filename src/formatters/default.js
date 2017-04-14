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
  if (report.results.length === 0) {
    return '';
  }

  const {results, errorCount, maxErrors, maxWarnings, warningCount} = report;

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
  response += maxErrors ? ` (Max Errors: ${maxErrors} )` : ''
  response = `\nStylint: ${warningCount} Warnings.`;
  response += maxWarnings ? ` (Max Warnings: ${maxWarnings} )` : ''

  response += kill ? '\nStylint: Over Error or Warning Limit.';
  response = `${formattedMessages}\n\n${response}`

  return response;
}

module.exports = defaultFormatter;


// var reporter = function( msg, done, kill ) {
// 	if ( done === 'done' ) {
// 		// total errors
// 		this.cache.msg = 'Stylint: ' + this.cache.errs.length + ' Errors.'
// 		this.cache.msg += this.config.maxErrors ? ' (Max Errors: ' + this.config.maxErrors + ')' : ''
// 		// total warnings
// 		this.cache.msg += '\nStylint: ' + this.cache.warnings.length + ' Warnings.'
// 		this.cache.msg += this.config.maxWarnings ? ' (Max Warnings: ' + this.config.maxWarnings + ')' : ''
//
// 		// if you set a max it kills the linter
// 		if ( kill === 'kill' ) {
// 			this.cache.msg += '\nStylint: Over Error or Warning Limit.'
// 		}
// 		else if ( this.cache.errs.length === 0 &&
// 			this.cache.warnings.length === 0 ) {
// 			this.cache.msg = ''
// 		}
//
// 		return this.done()
// 	}
//
// 	if ( this.reporter.pretty ) {
// 		return prettyReporter.call( this, msg )
// 	}
//
//
// }
//
// module.exports = reporter
