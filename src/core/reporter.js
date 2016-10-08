'use strict'

var groupBy = require( 'lodash.groupby' )
var chalk = require( 'chalk' )

/**
 * @description format output message for console (default)
 * @param  {object}   msg  error msg from one of the checks
 * @param  {string}   done whether or not this is the last message to output
 * @param  {string}   kill whether or not we're over one of our limits
 * @return {string | Function} either the formatted msg or done()
 */
var reporter = function( msg, done, kill ) {
	if ( done === 'done' ) {
		this.cache.msg = ''

		if ( this.cache.violations.length === 0 && kill !== 'kill' ) {
			return
		}

		var violations = groupBy( this.cache.violations, 'severity' )
		var numOfErrors = violations.Error ? violations.Error.length : 0
		var numOfWarnings = violations.Warning ? violations.Warning.length : 0

		this.cache.msg = 'Stylint: ' + numOfErrors + ' Errors.'
		this.cache.msg += this.config.maxErrors ? ' (Max Errors: ' + this.config.maxErrors + ')' : ''

		this.cache.msg += '\nStylint: ' + numOfWarnings + ' Warnings.'
		this.cache.msg += this.config.maxWarnings ? ' (Max Warnings: ' + this.config.maxWarnings + ')' : ''

		// if you set a max it kills the linter
		if ( kill === 'kill' ) {
			this.cache.msg += '\nStylint: Over Error or Warning Limit.'
		}

		return
	}

	var file = chalk.underline( msg.file )
	var col = typeof msg.col === 'number' && msg.col > 0 ? msg.col : null

	var severity = msg.severity.toLowerCase()
	severity = severity === 'warning' ?
		chalk.yellow( severity ) :
		chalk.red( severity )

	var rule = chalk.grey( msg.rule )

	// normal error or warning messages
	var defaultMessage = file + '\n' + msg.lineNo + ' ' + rule + ' ' + severity + ' ' + msg.message

	// if column data available, output slightly different line
	if ( typeof msg.col === 'number' && msg.col > -1 ) {
		defaultMessage = file + '\n' + msg.lineNo + ':' + msg.col + ' ' + rule + ' ' + severity + ' ' + msg.message
	}

	// weird syntax highlighting issue when this is inside a ternary
	var linePlusCol = msg.lineNo + ':' + col
	var messageObj = {
		file: file,
		lineData: col ? linePlusCol : msg.lineNo,
		severity: severity,
		description: msg.message,
		rule: rule
	}

	messageObj[file] = true
	this.cache.messages.push( messageObj )

	return defaultMessage
}

module.exports = reporter
