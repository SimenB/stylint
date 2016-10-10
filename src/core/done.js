'use strict';

function shouldExit1(maxErrors, maxWarnings, errorCount, warningCount) {
	// If there are any errors and no maximum defined
  if (maxErrors < 0 && errorCount > 0) {
    return true;
  }

  return maxErrors >= 0 && errorCount > maxErrors ||
		maxWarnings >= 0 && warningCount > maxWarnings;
}

/**
 * @description outputs our messages, wipes errs/warnings if watching
 * @returns {Object | Function} returns process exit if not watching, or obj otherwise
 */
var done = function() {
  var maxErrors = typeof this.config.maxErrors === 'number' ? this.config.maxErrors : -1;
  var maxWarnings = typeof this.config.maxWarnings === 'number' ? this.config.maxWarnings : -1;
  var report = this.cache.report;
  var errorCount = report.errorCount;
  var warningCount = report.warningCount;

  var shouldKill = shouldExit1(maxErrors, maxWarnings, errorCount, warningCount);

  this.state.exitCode = shouldKill ? 1 : 0;
  var message = this.reporter(report, {
    maxErrors: maxErrors,
    maxWarnings: maxWarnings,
    groupOutputByFile: this.config.groupOutputByFile,
    reporterOptions: this.config.reporterOptions
  }, shouldKill);

	// TODO: This is stupid, just mock out `console.log` or something
  if (!this.state.quiet && message) {
    console.log(message);
  }

	// don't kill the linter if watch is watching
	// else there's no more to do, so exit the process
  if (!this.state.watching) {
    this.callback(this.state.exitCode || null);
    return process.exit(this.state.exitCode);
  }

  var returnValue = {
    report: report,
    exitCode: this.state.exitCode,
    msg: message
  };

	// if watching we reset the errors/warnings arrays
  this.cache.messages = [];
  this.cache.report = {};

  return returnValue;
};

module.exports = done;
