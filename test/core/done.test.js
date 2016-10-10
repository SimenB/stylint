/* eslint-disable no-console */

'use strict';

const assert = require('assert');
const sinon = require('sinon');
const done = require('../../src/core/done');

describe('done', () => {
  let context;

  let report;

  beforeEach(() => {
    report = {
      messages: [],
      errorCount: 0,
      warningCount: 0,
    };

    context = {
      cache: {
        report,
      },
      callback: sinon.spy(),
      config: {
        maxErrors: -1,
        maxWarnings: -1,
      },
      reporter: sinon.stub(),
      state: {
        watching: true,
      },
    };

    sinon.stub(process, 'exit');
    sinon.stub(console, 'log');
  });

  afterEach(() => {
    process.exit.restore();
    console.log.restore();
  });

  describe('exitCode', () => {
    it('should exit with 0 if no errors or warnings', () => {
      done.call(context);

      assert.equal(context.state.exitCode, 0);
      assert.equal(process.exit.called, false);
      assert.equal(console.log.called, false);
    });

    it('should exit with 1 if errors over max limit', () => {
      context.cache.report.errorCount = 1;

      context.config.maxErrors = 0;

      done.call(context);

      assert.equal(context.state.exitCode, 1);
      assert.equal(process.exit.called, false);
      assert.equal(console.log.called, false);
    });

    it('should exit with 1 if warnings over max limit', () => {
      context.cache.report.warningCount = 1;

      context.config.maxWarnings = 0;

      done.call(context);

      assert.equal(context.state.exitCode, 1);
      assert.equal(process.exit.called, false);
      assert.equal(console.log.called, false);
    });

    it('should exit with 1 if error and no max limit', () => {
      context.cache.report.errorCount = 1;

      done.call(context);

      assert.equal(context.state.exitCode, 1);
      assert.equal(process.exit.called, false);
      assert.equal(console.log.called, false);
    });

    it('should exit with 0 if no warning and no max limit', () => {
      context.cache.report.warningCount = 1;

      done.call(context);

      assert.equal(context.state.exitCode, 0);
      assert.equal(process.exit.called, false);
      assert.equal(console.log.called, false);
    });

    it('should call process exit if not watching', () => {
      context.state.watching = false;

      done.call(context);

      assert.equal(context.state.exitCode, 0);
      assert.equal(process.exit.calledOnce, true);
      assert(process.exit.calledWith(0));
    });
  });

  describe('logging report', () => {
    it('should log if quiet is not true, and there is a message', () => {
      context.state.quiet = false;
      context.reporter.returns('some message');

      done.call(context);

      assert(console.log.calledOnce);
      assert(console.log.calledWith('some message'));
    });

    it('should not log if quiet is true, and there is a message', () => {
      context.state.quiet = true;
      context.reporter.returns('some message');

      done.call(context);

      assert.equal(console.log.called, false);
    });

    it('should not log if quiet is not true, and there is no message', () => {
      context.state.quiet = false;

      done.call(context);

      assert.equal(console.log.called, false);
    });
  });

  describe('calling reporter', () => {
    it('should call report even if no messages', () => {
      done.call(context);

      assert(context.reporter.calledOnce);
      assert(context.reporter.calledWith(
        report,
        {
          maxErrors: -1,
          maxWarnings: -1,
          groupOutputByFile: undefined,
          reporterOptions: undefined,
        },
        false
      ));
    });

    it('should pass along groupOutputByFile and reporterOptions', () => {
      context.config.groupOutputByFile = true;
      context.config.reporterOptions = true;

      done.call(context);

      assert(context.reporter.calledOnce);
      assert(context.reporter.calledWith(
        report,
        {
          maxErrors: -1,
          maxWarnings: -1,
          groupOutputByFile: true,
          reporterOptions: true,
        },
        false
      ));
    });

    it('should handle missing maxErrors and maxWarnings', () => {
      delete context.config.maxErrors;
      delete context.config.maxWarnings;

      done.call(context);

      assert(context.reporter.calledOnce);
      assert(context.reporter.calledWith(
        report,
        {
          maxErrors: -1,
          maxWarnings: -1,
          groupOutputByFile: undefined,
          reporterOptions: undefined,
        },
        false
      ));
    });

    it('should pass along exitCode', () => {
      context.cache.report.errorCount = 1;

      done.call(context);

      assert(context.reporter.calledOnce);
      assert(context.reporter.args[0][2]);
    });
  });
});
