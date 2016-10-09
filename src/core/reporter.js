'use strict'

var _ = require( 'lodash' )
var chalk = require( 'chalk' )
var columnify = require( 'columnify' )

/**
 * @description format output message for console (default)
 * @param  {Object[]} messages  error msg from one of the checks
 * @param  {boolean} [kill] whether or not we're over one of our limits
 * @param  {Object} [options] options provided to the reporter, and some relevant config
 * @return {string} the formatted message
 */
// TODO: Structure input to this method better (#366)
var reporter = function( messages, kill, options ) {
	if ( messages.length === 0 ) {
		return ''
	}

	options = options || {}
	var formattedMessages = messages.map( function( msg ) {
		var file = chalk.underline( msg.file )
		var col = typeof msg.col === 'number' && msg.col > 0 ? msg.col : null
		var lineData = col ? msg.lineNo + ':' + col : msg.lineNo

		var severity = msg.severity.toLowerCase()
		severity = severity === 'warning' ?
			chalk.yellow( severity ) :
			chalk.red( severity )

		var rule = chalk.grey( msg.rule )

		return {
			file: file,
			lineData: lineData,
			severity: severity,
			message: msg.message,
			rule: rule
		}
	} )

	if ( options.groupOutputByFile ) {
		// iterate over arrays of message objects
		// each array consists of all the errors and warnings for a file
		// columnify the errors/warnings and prefix them with the file name
		formattedMessages = _.chain( formattedMessages )
			.groupBy( 'file' )
			.map( function( value, key ) {
				return key + '\n' + columnify( value, options.reporterOptions )
			} )
			.value()
	}
	else {
		formattedMessages = formattedMessages.map( function( output ) {
			return output.file + '\n' + output.lineData + ' ' + output.rule + ' ' + output.severity + ' ' + output.message
		} )
	}

	formattedMessages = formattedMessages.reduce( function( memo, msg ) {
		return memo + msg + '\n\n'
	}, '' )
		.trim()

	var groupedMessages = _.countBy( messages, 'severity' )
	var numOfErrors = groupedMessages.Error || 0
	var numOfWarnings = groupedMessages.Warning || 0

	var formattedMessage = 'Stylint: ' + numOfErrors + ' Errors.'
	formattedMessage += options.maxErrors >= 0 ? ' (Max Errors: ' + options.maxErrors + ')' : ''

	formattedMessage += '\nStylint: ' + numOfWarnings + ' Warnings.'
	formattedMessage += options.maxWarnings >= 0 ? ' (Max Warnings: ' + options.maxWarnings + ')' : ''

	// if you set a max it kills the linter
	if ( kill ) {
		formattedMessage += '\nStylint: Over Error or Warning Limit.'
	}

	return ( formattedMessages + '\n\n' + formattedMessage ).trim()
}

module.exports = reporter
