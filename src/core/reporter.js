'use strict'

var groupBy = require( 'lodash.groupby' )

/**
 * format output message for console
 * @param  {object}   msg  error msg from one of the checks
 * @param  {string}   done whether or not this is the last message to output
 * @param  {string}   kill whether or not we're over one of our limits
 * @return {string | undefined} either the formatted msg or nothing
 */
var reporter = function( msg, done, kill ) {
	if ( done === 'done' ) {
		this.cache.msg = ''

		if ( this.cache.allViolations.length === 0 && kill !== 'kill' ) {
			return
		}

		var violations = groupBy( this.cache.allViolations, 'severity' )
		var numOfErrors = violations.Error ? violations.Error.length : 0
		var numOfWarnings = violations.Warning ? violations.Warning.length : 0

		this.cache.msg += '\nStylint: ' + numOfErrors + ' Errors.'
		this.cache.msg += this.config.maxErrors ? ' (Max Errors: ' + this.config.maxErrors + ')' : ''

		this.cache.msg += '\nStylint: ' + numOfWarnings + ' Warnings.'
		this.cache.msg += this.config.maxWarnings ? ' (Max Warnings: ' + this.config.maxWarnings + ')' : ''

		// if you set a max it kills the linter
		if ( kill === 'kill' ) {
			this.cache.msg += '\nStylint: Over Error or Warning Limit.'
		}

		return
	}

	return msg.severity + ': ' + msg.message + '\nFile: ' + msg.file + '\nLine: ' + msg.lineNo + ': ' + msg.origLine.trim()
}

module.exports = reporter
