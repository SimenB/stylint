'use strict'

var groupBy = require( 'lodash' ).groupBy

function shouldExit1( warningsOrErrors, maxErrors, maxWarnings ) {
	var numberofErrors = warningsOrErrors.Error && warningsOrErrors.Error.length || 0
	var numberofWarnings = warningsOrErrors.Warning && warningsOrErrors.Warning.length || 0

	if ( maxErrors < 0 && numberofErrors > 0 ) {
		return true
	}

	return maxErrors >= 0 && numberofErrors > maxErrors ||
		maxWarnings >= 0 && numberofWarnings > maxWarnings
}

/**
 * @description outputs our messages, wipes errs/warnings if watching
 * @returns {Object | Function} returns process exit if not watching, or obj otherwise
 */
var done = function() {
	var maxErrors = typeof this.config.maxErrors === 'number' ? this.config.maxErrors : -1
	var maxWarnings = typeof this.config.maxWarnings === 'number' ? this.config.maxWarnings : -1

	var shouldKill = shouldExit1( groupBy( this.cache.messages, 'severity' ), maxErrors, maxWarnings )

	this.state.exitCode = shouldKill ? 1 : 0

	var message = this.reporter( this.cache.messages, shouldKill, {
		maxErrors: maxErrors,
		maxWarnings: maxWarnings,
		groupOutputByFile: this.config.groupOutputByFile,
		reporterOptions: this.config.reporterOptions
	} )

	// when testing we want to silence the console a bit, so we have the quiet option
	if ( !this.state.quiet && message ) {
		console.log( message )
	}

	// don't kill the linter if watch is watching
	// else there's no more to do, so exit the process
	if ( !this.state.watching ) {
		this.callback( this.state.exitCode || null )
		return process.exit( this.state.exitCode )
	}

	var returnValue = {
		messages: this.cache.messages.slice( 0 ),
		exitCode: this.state.exitCode,
		msg: message
	}

	// if watching we reset the errors/warnings arrays
	this.cache.messages = []

	return returnValue
}

module.exports = done
