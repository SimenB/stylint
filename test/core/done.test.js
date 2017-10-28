/* eslint-disable no-console */

'use strict';

const sinon = require('sinon');

const stylint = require('../../index');
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
      callback: jest.fn(),
      config: {
        maxErrors: -1,
        maxWarnings: -1,
      },
      formatter: jest.fn(),
      state: {
        watching: true,
      },
    };

    jest.spyOn(process, 'exit').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('exitCode', () => {
    it('should exit with 0 if no errors or warnings', () => {
      done.call(context);

      expect(context.state.exitCode).toEqual(0);
      expect(process.exit).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should exit with 1 if errors over max limit', () => {
      context.cache.report.errorCount = 1;

      context.config.maxErrors = 0;

      done.call(context);

      expect(context.state.exitCode).toEqual(1);
      expect(process.exit).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should exit with 1 if warnings over max limit', () => {
      context.cache.report.warningCount = 1;

      context.config.maxWarnings = 0;

      done.call(context);

      expect(context.state.exitCode).toEqual(1);
      expect(process.exit).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should exit with 1 if error and no max limit', () => {
      context.cache.report.errorCount = 1;

      done.call(context);

      expect(context.state.exitCode).toEqual(1);
      expect(process.exit).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should exit with 0 if no warning and no max limit', () => {
      context.cache.report.warningCount = 1;

      done.call(context);

      expect(context.state.exitCode).toEqual(0);
      expect(process.exit).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should call process exit if not watching', () => {
      context.state.watching = false;

      done.call(context);

      expect(context.state.exitCode).toEqual(0);
      expect(process.exit).toHaveBeenCalledTimes(1);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('logging report', () => {
    it('should log if quiet is not true, and there is a message', () => {
      context.state.quiet = false;
      context.formatter.mockImplementation(() => 'some message');

      done.call(context);

      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('some message');
    });

    it('should not log if quiet is true, and there is a message', () => {
      context.state.quiet = true;
      context.formatter.mockImplementation(() => 'some message');

      done.call(context);

      expect(console.log).not.toHaveBeenCalled();
    });

    it('should not log if quiet is not true, and there is no message', () => {
      context.state.quiet = false;

      done.call(context);

      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('calling formatter', () => {
    it('should call report even if no messages', () => {
      done.call(context);

      expect(context.formatter).toHaveBeenCalledTimes(1);
      expect(context.formatter).toHaveBeenCalledWith(
        report,
        {
          maxErrors: -1,
          maxWarnings: -1,
          groupOutputByFile: undefined,
          formatterOptions: undefined,
        },
        false
      );
    });

    it('should pass along groupOutputByFile and formatterOptions', () => {
      context.config.groupOutputByFile = true;
      context.config.formatter = true;

      done.call(context);

      expect(context.formatter).toHaveBeenCalledTimes(1);
      expect(context.formatter).toHaveBeenCalledWith(
        report,
        {
          maxErrors: -1,
          maxWarnings: -1,
          groupOutputByFile: true,
          formatterOptions: true,
        },
        false
      );
    });

    it('should handle missing maxErrors and maxWarnings', () => {
      delete context.config.maxErrors;
      delete context.config.maxWarnings;

      done.call(context);

      expect(context.formatter).toHaveBeenCalledTimes(1);
      expect(context.formatter).toHaveBeenCalledWith(
        report,
        {
          maxErrors: -1,
          maxWarnings: -1,
          groupOutputByFile: undefined,
          formatterOptions: undefined,
        },
        false
      );
    });

    it('should pass along exitCode', () => {
      context.cache.report.errorCount = 1;

      done.call(context);

      expect(context.formatter).toHaveBeenCalledTimes(1);
      expect(context.formatter.mock.calls[0][2]).toEqual(true);
    });
  });
});

describe('Done, again: ', () => {
  const app = stylint().create();

  app.state.quiet = true;
  app.state.watching = true;

  beforeEach(() => {
    app.state.quiet = true;
    app.state.watching = true;
    app.cache.report = { results: [], errorCount: 0, warningCount: 0 };
    app.state.exitCode = 0;
  });

  it('should return an object', () => {
    expect(app.done()).toBeInstanceOf(Object);
  });

  it('which should have msg as a property', () => {
    expect(app.done().msg).toBeDefined();
  });

  it('exit code should be 0 if no errs', () => {
    expect(app.done().exitCode).toEqual(0);
  });

  it('exit code should be 0 if has warnings and no errs', () => {
    app.cache.report.warningCount = 1;
    expect(app.done().exitCode).toEqual(0);
  });

  it('msg should be empty if no errs or warnings', () => {
    expect(app.done().msg).toEqual('');
  });

  it('exit code of 1 if not clear', () => {
    app.cache.report.errorCount = 1;
    expect(app.done().exitCode).toEqual(1);
  });

  it('exit code should be 1 if over max warnings', () => {
    app.config.maxWarnings = 0;
    app.config.maxErrors = 10;
    app.cache.report.warningCount = 1;

    expect(app.done().exitCode).toEqual(1);
  });

  it.skip('should exit if watch off', () => {
    app.state.watching = false;
    sinon.spy(app, 'done');
    app.done();

    app.done.getCall(0).returned(sinon.match.same(process.exit));
    app.state.watching = true;
  });
});
