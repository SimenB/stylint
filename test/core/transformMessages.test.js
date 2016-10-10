'use strict';

var assert = require('assert');
var sinon = require('sinon');
var transformMessages = require('../../src/core/transformMessages');

// Strict was added in node@1.2.0
// https://nodejs.org/api/assert.html#assert_assert_deepstrictequal_actual_expected_message
var deepEqual = assert.deepStrictEqual || assert.deepEqual;

describe('transforming messages for report', function () {
  var context;

  var message;
  var severity;
  var file;
  var line;
  var column;
  var source;
  var ruleId;

  function createMessage () {
    return {
      message: message,
      severity: severity,
      file: file,
      line: line,
      column: column,
      source: source,
      ruleId: ruleId
    };
  }

  beforeEach(function () {
    context = {
      cache: {
        messages: []
      },
      done: sinon.spy()
    };

    message = 'some message';
    severity = 'error';
    file = 'some-file.styl';
    line = 1;
    column = 5;
    source = '.class {';
    ruleId = 'some rule';
  });

  it('should call report even if no messages', function () {
    deepEqual(transformMessages.call(context), {
      results: [],
      errorCount: 0,
      warningCount: 0
    });
  });

  it('should transform single message correctly', function () {
    context.cache.messages = [createMessage()];

    deepEqual(transformMessages.call(context), {
      results: [{
        filePath: 'some-file.styl',
        messages: [{
          column: 5,
          line: 1,
          message: 'some message',
          source: '.class {',
          ruleId: 'some rule',
          severity: 'error'
        }],
        errorCount: 1,
        warningCount: 0
      }],
      errorCount: 1,
      warningCount: 0
    });
  });

  it('should assign result to correct field', function () {
    context.cache.messages = [createMessage()];

    var report = transformMessages.call(context);
    assert.equal(report, context.cache.report);
  });

  it('should transform multiple messages from same file correctly', function () {
    var message1 = createMessage();

    line = 5;
    message = 'some other message';

    context.cache.messages = [message1, createMessage()];

    deepEqual(transformMessages.call(context), {
      results: [{
        filePath: 'some-file.styl',
        messages: [{
          column: 5,
          line: 1,
          message: 'some message',
          source: '.class {',
          ruleId: 'some rule',
          severity: 'error'
        }, {
          column: 5,
          line: 5,
          message: 'some other message',
          source: '.class {',
          ruleId: 'some rule',
          severity: 'error'
        }],
        errorCount: 2,
        warningCount: 0
      }],
      errorCount: 2,
      warningCount: 0
    });
  });

  it('should transform multiple messages for different files correctly', function () {
    var message1 = createMessage();

    line = 5;
    message = 'some other message';
    file = 'some-other-file.styl';

    context.cache.messages = [message1, createMessage()];

    deepEqual(transformMessages.call(context), {
      results: [{
        filePath: 'some-file.styl',
        messages: [{
          column: 5,
          line: 1,
          message: 'some message',
          source: '.class {',
          ruleId: 'some rule',
          severity: 'error'
        }],
        errorCount: 1,
        warningCount: 0
      }, {
        filePath: 'some-other-file.styl',
        messages: [{
          column: 5,
          line: 5,
          message: 'some other message',
          source: '.class {',
          ruleId: 'some rule',
          severity: 'error'
        }],
        errorCount: 1,
        warningCount: 0
      }],
      errorCount: 2,
      warningCount: 0
    });
  });

  it('should call done by default', function () {
    transformMessages.call(context);

    assert(context.done.calledOnce);
  });

  it('should not call done if skipDone passed in', function () {
    transformMessages.call(context, true);

    assert(!context.done.called);
  });
});
