'use strict';

var assert = require('assert');
var sinon = require('sinon');
var done = require('../../src/core/done');

describe('done', function() {
  var context;

  var report;

  beforeEach(function() {
    report = {
      messages: [],
      errorCount: 0,
      warningCount: 0
    };

    context = {
      cache: {
        report: report
      },
      callback: sinon.spy(),
      config: {
        maxErrors: -1,
        maxWarnings: -1
      },
      reporter: sinon.stub(),
      state: {
        watching: true
      }
    };

    sinon.stub(process, 'exit');
    sinon.stub(console, 'log');
  });

  afterEach(function() {
    process.exit.restore();
    console.log.restore();
  });

  describe('exitCode', function() {
    it('should exit with 0 if no errors or warnings', function() {
      done.call(context);

      assert.equal(context.state.exitCode, 0);
      assert.equal(process.exit.called, false);
      assert.equal(console.log.called, false);
    });

    it('should exit with 1 if errors over max limit', function() {
      context.cache.report.errorCount = 1;

      context.config.maxErrors = 0;

      done.call(context);

      assert.equal(context.state.exitCode, 1);
      assert.equal(process.exit.called, false);
      assert.equal(console.log.called, false);
    });

    it('should exit with 1 if warnings over max limit', function() {
      context.cache.report.warningCount = 1;

      context.config.maxWarnings = 0;

      done.call(context);

      assert.equal(context.state.exitCode, 1);
      assert.equal(process.exit.called, false);
      assert.equal(console.log.called, false);
    });

    it('should exit with 1 if error and no max limit', function() {
      context.cache.report.errorCount = 1;

      done.call(context);

      assert.equal(context.state.exitCode, 1);
      assert.equal(process.exit.called, false);
      assert.equal(console.log.called, false);
    });

    it('should exit with 0 if no warning and no max limit', function() {
      context.cache.report.warningCount = 1;

      done.call(context);

      assert.equal(context.state.exitCode, 0);
      assert.equal(process.exit.called, false);
      assert.equal(console.log.called, false);
    });

    it('should call process exit if not watching', function() {
      context.state.watching = false;

      done.call(context);

      assert.equal(context.state.exitCode, 0);
      assert.equal(process.exit.calledOnce, true);
      assert(process.exit.calledWith(0));
    });
  });

  describe('logging report', function() {
    it('should log if quiet is not true, and there is a message', function() {
      context.state.quiet = false;
      context.reporter.returns('some message');

      done.call(context);

      assert(console.log.calledOnce);
      assert(console.log.calledWith('some message'));
    });

    it('should not log if quiet is true, and there is a message', function() {
      context.state.quiet = true;
      context.reporter.returns('some message');

      done.call(context);

      assert.equal(console.log.called, false);
    });

    it('should not log if quiet is not true, and there is no message', function() {
      context.state.quiet = false;

      done.call(context);

      assert.equal(console.log.called, false);
    });
  });

  describe('calling reporter', function() {
    it('should call report even if no messages', function() {
      done.call(context);

      assert(context.reporter.calledOnce);
      assert(context.reporter.calledWith(
				report,
        {
          maxErrors: -1,
          maxWarnings: -1,
          groupOutputByFile: undefined,
          reporterOptions: undefined
        },
				false
			));
    });

    it('should pass along groupOutputByFile and reporterOptions', function() {
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
          reporterOptions: true
        },
				false
			));
    });

    it('should handle missing maxErrors and maxWarnings', function() {
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
          reporterOptions: undefined
        },
				false
			));
    });

    it('should pass along exitCode', function() {
      context.cache.report.errorCount = 1;

      done.call(context);

      assert(context.reporter.calledOnce);
      assert(context.reporter.args[0][2]);
    });
  });
});
