'use strict';

function shouldExit1(maxErrors, maxWarnings, errorCount, warningCount) {
  // If there are any errors and no maximum defined
  if (maxErrors < 0 && errorCount > 0) {
    return true;
  }

  return (maxErrors >= 0 && errorCount > maxErrors) || (maxWarnings >= 0 && warningCount > maxWarnings);
}

/**
 * @description Outputs our messages, wipes errs/warnings if watching.
 * @returns {Object | Function} Returns process exit if not watching, or obj otherwise.
 */
const done = function() {
  const maxErrors = typeof this.config.maxErrors === 'number' ? this.config.maxErrors : -1;
  const maxWarnings = typeof this.config.maxWarnings === 'number' ? this.config.maxWarnings : -1;
  const report = this.cache.report;
  const errorCount = report.errorCount;
  const warningCount = report.warningCount;

  const shouldKill = shouldExit1(maxErrors, maxWarnings, errorCount, warningCount);

  this.state.exitCode = shouldKill ? 1 : 0;
  const message = this.formatter(
    report,
    {
      maxErrors,
      maxWarnings,
      groupOutputByFile: this.config.groupOutputByFile,
      formatterOptions: this.config.formatter,
    },
    shouldKill
  );

  // TODO: This is stupid, just mock out `console.log` or something
  if (!this.state.quiet && message) {
    // eslint-disable-next-line no-console
    console.log(message);
  }

  // don't kill the linter if watch is watching
  // else there's no more to do, so exit the process
  if (!this.state.watching) {
    this.callback(this.state.exitCode || null);
    // eslint-disable-next-line no-process-exit
    return process.exit(this.state.exitCode);
  }

  const returnValue = {
    report,
    exitCode: this.state.exitCode,
    msg: message,
  };

  // if watching we reset the errors/warnings arrays
  this.cache.messages = [];
  this.cache.report = {};

  return returnValue;
};

module.exports = done;
