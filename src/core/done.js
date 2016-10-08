'use strict'

var groupBy = require( 'lodash.groupby' )
var columnify = require( 'columnify' )

function shouldExit1( warningsOrErrors ) {
	var maxErrs = typeof this.config.maxErrors === 'number' ? this.config.maxErrors : null
	var maxWarnings = typeof this.config.maxWarnings === 'number' ? this.config.maxWarnings : null
	var numberofErrors = warningsOrErrors.Error && warningsOrErrors.Error.length || 0
	var numberofWarnings = warningsOrErrors.Warning && warningsOrErrors.Warning.length || 0

	if ( maxErrs == null && numberofErrors > 0 ) {
		return true
	}

	return maxErrs != null && numberofErrors > this.config.maxErrors ||
		maxWarnings != null && numberofWarnings > this.config.maxWarnings
}

/**
 * @description outputs our messages, wipes errs/warnings if watching
 * @returns {Object | Function} returns process exit if not watching, or obj otherwise
 */
var done = function() {
	var msg = ''
	var groupedByFile = {}
	var msgGrouped
	var group = this.config.groupOutputByFile
	var opts = this.config.reporterOptions || {}

	var violations = this.cache.violations
		.filter( function( msg ) { return !!msg && !!msg.message } )

	var shouldKill = shouldExit1.call( this, groupBy( violations, 'severity' ) )

	this.state.exitCode = shouldKill ? 1 : 0

	// when testing we want to silence the console a bit, so we have the quiet option
	if ( !this.state.quiet ) {
		violations.forEach( function( msg ) { this.reporter( msg ) }.bind( this ) )

		this.reporter( null, 'done', shouldKill ? 'kill' : null )

		// by default group warnings and errs by file
		if ( group && this.cache.messages ) {
			this.cache.messages.forEach( function( output ) {
				var file = output.file

				if ( groupedByFile.hasOwnProperty( file ) ) {
					groupedByFile[file].push( output )
				}
				else {
					groupedByFile[file] = [output]
				}
			} )

			// iterate over arrays of message objects
			// each array consists of all the errors and warnings for a file
			// columnify the errors/warnings and prefix them with the file name
			msgGrouped = Object.keys( groupedByFile ).map( function( key ) {
				return key + '\n' + columnify( groupedByFile[key], opts ) + '\n\n'
			} )
		}

		var warningsOrErrors = violations
			.map( function( violation ) {
				return violation.message
			} )
			.filter( function( message ) {
				return !!message
			} )

		if ( warningsOrErrors.length ) {
			if ( group ) {
				msg += msgGrouped
			}
			else {
				msg = warningsOrErrors.join( '\n\n' ) + '\n\n'
			}
		}

		msg += this.cache.msg
		msg = msg ? msg.trim() : msg

		if ( msg ) {
			console.log( msg )
		}
	}

	// don't kill the linter if watch is watching
	// else there's no more to do, so exit the process
	if ( !this.state.watching ) {
		this.callback( this.state.exitCode || null )
		return process.exit( this.state.exitCode )
	}

	var returnValue = {
		violations: this.cache.violations.slice( 0 ),
		exitCode: this.state.exitCode,
		msg: this.cache.msg.trim()
	}

	// if watching we reset the errors/warnings arrays
	this.cache.violations = []

	return returnValue
}

module.exports = done
