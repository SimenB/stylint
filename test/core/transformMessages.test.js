'use strict';

const transformMessages = require('../../src/core/transformMessages');

describe('transforming messages for report', () => {
  let context;

  let message;
  let severity;
  let file;
  let line;
  let column;
  let source;
  let ruleId;

  function createMessage() {
    return {
      message,
      severity,
      file,
      line,
      column,
      source,
      ruleId,
    };
  }

  beforeEach(() => {
    context = {
      cache: {
        messages: [],
      },
      done: jest.fn(),
    };

    message = 'some message';
    severity = 'error';
    file = 'some-file.styl';
    line = 1;
    column = 5;
    source = '.class {';
    ruleId = 'some rule';
  });

  it('should call report even if no messages', () => {
    expect(transformMessages.call(context)).toEqual({
      results: [],
      errorCount: 0,
      warningCount: 0,
    });
  });

  it('should transform single message correctly', () => {
    context.cache.messages = [createMessage()];

    expect(transformMessages.call(context)).toEqual({
      results: [{
        filePath: 'some-file.styl',
        messages: [{
          column: 5,
          line: 1,
          message: 'some message',
          source: '.class {',
          ruleId: 'some rule',
          severity: 'error',
        }],
        errorCount: 1,
        warningCount: 0,
      }],
      errorCount: 1,
      warningCount: 0,
    });
  });

  it('should assign result to correct field', () => {
    context.cache.messages = [createMessage()];

    const report = transformMessages.call(context);
    expect(report).toEqual(context.cache.report);
  });

  it('should transform multiple messages from same file correctly', () => {
    const message1 = createMessage();

    line = 5;
    message = 'some other message';

    context.cache.messages = [message1, createMessage()];

    expect(transformMessages.call(context)).toEqual({
      results: [{
        filePath: 'some-file.styl',
        messages: [{
          column: 5,
          line: 1,
          message: 'some message',
          source: '.class {',
          ruleId: 'some rule',
          severity: 'error',
        }, {
          column: 5,
          line: 5,
          message: 'some other message',
          source: '.class {',
          ruleId: 'some rule',
          severity: 'error',
        }],
        errorCount: 2,
        warningCount: 0,
      }],
      errorCount: 2,
      warningCount: 0,
    });
  });

  it('should transform multiple messages for different files correctly', () => {
    const message1 = createMessage();

    line = 5;
    message = 'some other message';
    file = 'some-other-file.styl';

    context.cache.messages = [message1, createMessage()];

    expect(transformMessages.call(context)).toEqual({
      results: [{
        filePath: 'some-file.styl',
        messages: [{
          column: 5,
          line: 1,
          message: 'some message',
          source: '.class {',
          ruleId: 'some rule',
          severity: 'error',
        }],
        errorCount: 1,
        warningCount: 0,
      }, {
        filePath: 'some-other-file.styl',
        messages: [{
          column: 5,
          line: 5,
          message: 'some other message',
          source: '.class {',
          ruleId: 'some rule',
          severity: 'error',
        }],
        errorCount: 1,
        warningCount: 0,
      }],
      errorCount: 2,
      warningCount: 0,
    });
  });

  it('should call done by default', () => {
    transformMessages.call(context);

    expect(context.done).toHaveBeenCalledTimes(1);
  });

  it('should not call done if skipDone passed in', () => {
    transformMessages.call(context, true);

    expect(context.done).not.toHaveBeenCalled();
  });
});
