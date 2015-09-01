'use strict'

var groupBy = require( 'lodash.groupby' )

function shouldKill( warningsOrErrors ) {
	var maxErrs = typeof this.config.maxErrors === 'number' ? this.config.maxErrors : false
	var maxWarnings = typeof this.config.maxWarnings === 'number' ? this.config.maxWarnings : false

	return maxErrs && warningsOrErrors.Error && warningsOrErrors.Error.length > this.config.maxErrors ||
		maxWarnings && warningsOrErrors.Warning && warningsOrErrors.Warning.length > this.config.maxWarnings
}
/**
 * @description outputs our messages, wipes errs/warnings if watching
 * @returns {Object | Function} returns process exit if not watching, or obj otherwise
 */
var done = function() {
	var warningsOrErrors = []
	var msg = ''

	var errors = this.cache.allViolations.filter( function( e ) {
		return e.severity === 'Error'
	} )

	// if no errors, give clean exit code
	if ( errors.length > 0 ) {
		this.state.exitCode = 1
	}

	// when testing we want to silence the console a bit, so we have the quiet option
	if ( !this.state.quiet ) {
		this.cache.allViolations.forEach( function( violation ) {
			this.reporter( violation )
		}.bind( this ) )

		warningsOrErrors = groupBy( this.cache.allViolations, 'severity' )

		this.reporter( null, 'done', shouldKill.call( this, warningsOrErrors ) ? 'kill' : null )

		warningsOrErrors = []
			.concat( warningsOrErrors.Error, warningsOrErrors.Warning )
			.map( function( violation ) {
				return violation.message
			} )
			.filter( function( message ) {
				return !!message
			} )

		if ( warningsOrErrors.length ) {
			msg = warningsOrErrors.join( '\n\n' ) + '\n'
		}

		msg += '\n' + this.cache.msg
		msg = msg.trim()

		if ( msg ) {
			console.log( msg )
		}
	}

	// dont kill the linter if watch is watchin
	// else theres no more to do, so exit the process
	if ( !this.state.watching ) {
		return process.exit( this.state.exitCode )
	}

	var returnValue = {
		allViolations: this.cache.allViolations.slice( 0 ),
		exitCode: this.state.exitCode,
		msg: this.cache.msg
	}

	// if watching we reset the errors/warnings arrays
	this.cache.allViolations = []

	return returnValue
}

module.exports = done
