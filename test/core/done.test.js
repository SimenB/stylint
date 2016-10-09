'use strict'

var assert = require( 'assert' )
var sinon = require( 'sinon' )
var done = require( '../../src/core/done' )

// Strict was added in node@1.2.0
// https://nodejs.org/api/assert.html#assert_assert_deepstrictequal_actual_expected_message
var deepEqual = assert.deepStrictEqual || assert.deepEqual

describe( 'done', function() {
	var context

	var message
	var severity
	var file
	var line
	var column
	var source
	var ruleId

	function createMessage() {
		return {
			message: message,
			severity: severity,
			file: file,
			line: line,
			column: column,
			source: source,
			ruleId: ruleId
		}
	}

	beforeEach( function() {
		context = {
			cache: {
				messages: [],
				msg: ''
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
		}

		message = 'some message'
		severity = 'error'
		file = 'some-file.styl'
		line = 1
		column = 5
		source = '.class {'
		ruleId = 'some rule'

		sinon.stub( process, 'exit' )
		sinon.stub( console, 'log' )
	} )

	afterEach( function() {
		process.exit.restore()
		console.log.restore()
	} )

	describe( 'exitCode', function() {
		it( 'should exit with 0 if no errors or warnings', function() {
			done.call( context )

			assert.equal( context.state.exitCode, 0 )
			assert.equal( process.exit.called, false )
			assert.equal( console.log.called, false )
		} )

		it( 'should exit with 1 if errors over max limit', function() {
			context.cache.messages = [{
				severity: 'error'
			}]

			context.config.maxErrors = 0

			done.call( context )

			assert.equal( context.state.exitCode, 1 )
			assert.equal( process.exit.called, false )
			assert.equal( console.log.called, false )
		} )

		it( 'should exit with 1 if warnings over max limit', function() {
			context.cache.messages = [{
				severity: 'warning'
			}]

			context.config.maxWarnings = 0

			done.call( context )

			assert.equal( context.state.exitCode, 1 )
			assert.equal( process.exit.called, false )
			assert.equal( console.log.called, false )
		} )

		it( 'should exit with 1 if error and no max limit', function() {
			context.cache.messages = [{
				severity: 'error'
			}]

			done.call( context )

			assert.equal( context.state.exitCode, 1 )
			assert.equal( process.exit.called, false )
			assert.equal( console.log.called, false )
		} )

		it( 'should exit with 0 if no warning and no max limit', function() {
			context.cache.messages = [{
				severity: 'warning'
			}]

			done.call( context )

			assert.equal( context.state.exitCode, 0 )
			assert.equal( process.exit.called, false )
			assert.equal( console.log.called, false )
		} )

		it( 'should call process exit if not watching', function() {
			context.state.watching = false

			done.call( context )

			assert.equal( context.state.exitCode, 0 )
			assert.equal( process.exit.calledOnce, true )
			assert( process.exit.calledWith( 0 ) )
		} )
	} )

	describe( 'logging report', function() {
		it( 'should log if quiet is not true, and there is a message', function() {
			context.state.quiet = false
			context.reporter.returns( 'some message' )

			done.call( context )

			assert( console.log.calledOnce )
			assert( console.log.calledWith( 'some message' ) )
		} )

		it( 'should not log if quiet is true, and there is a message', function() {
			context.state.quiet = true
			context.reporter.returns( 'some message' )

			done.call( context )

			assert.equal( console.log.called, false )
		} )

		it( 'should not log if quiet is not true, and there is no message', function() {
			context.state.quiet = false

			done.call( context )

			assert.equal( console.log.called, false )
		} )
	} )

	describe( 'transforming messages for report', function() {
		it( 'should call report even if no messages', function() {
			done.call( context )

			assert( context.reporter.calledOnce )
			assert( context.reporter.calledWith(
				{
					results: [],
					errorCount: 0,
					warningCount: 0
				},
				{
					maxErrors: -1,
					maxWarnings: -1,
					groupOutputByFile: undefined,
					reporterOptions: undefined
				},
				false
			) )
		} )

		it( 'should pass along groupOutputByFile and reporterOptions', function() {
			context.config.groupOutputByFile = true
			context.config.reporterOptions = true

			done.call( context )

			assert( context.reporter.calledOnce )
			assert( context.reporter.calledWith(
				{
					results: [],
					errorCount: 0,
					warningCount: 0
				},
				{
					maxErrors: -1,
					maxWarnings: -1,
					groupOutputByFile: true,
					reporterOptions: true
				},
				false
			) )
		} )

		it( 'should handle missing maxErrors and maxWarnings', function() {
			delete context.config.maxErrors
			delete context.config.maxWarnings

			done.call( context )

			assert( context.reporter.calledOnce )
			assert( context.reporter.calledWith(
				{
					results: [],
					errorCount: 0,
					warningCount: 0
				},
				{
					maxErrors: -1,
					maxWarnings: -1,
					groupOutputByFile: undefined,
					reporterOptions: undefined
				},
				false
			) )
		} )

		it( 'should pass along exitCode', function() {
			context.cache.messages = [createMessage()]

			done.call( context )

			assert( context.reporter.calledOnce )
			assert( context.reporter.args[0][2] )
		} )

		it( 'should transform single message correctly', function() {
			context.cache.messages = [createMessage()]

			done.call( context )

			assert( context.reporter.calledOnce )
			deepEqual( context.reporter.args[0][0], {
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
			} )
		} )

		it( 'should transform multiple messages from same file correctly', function() {
			var message1 = createMessage()

			line = 5
			message = 'some other message'

			context.cache.messages = [message1, createMessage()]

			done.call( context )

			assert( context.reporter.calledOnce )
			deepEqual( context.reporter.args[0][0], {
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
			} )
		} )

		it( 'should transform multiple messages for different files correctly', function() {
			var message1 = createMessage()

			line = 5
			message = 'some other message'
			file = 'some-other-file.styl'

			context.cache.messages = [message1, createMessage()]

			done.call( context )

			assert( context.reporter.calledOnce )
			deepEqual( context.reporter.args[0][0], {
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
			} )
		} )
	} )
} )
