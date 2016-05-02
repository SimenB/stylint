'use strict'

function getExitCode( errsLength, warningsLength, maxErrors, maxWarnings ) {
	if ( errsLength > 0 ) {
		if ( typeof maxErrors === 'number' ) {
			if ( errsLength > maxErrors ) return 1
		}
		else return 1
	}

	if ( typeof maxWarnings === 'number' && warningsLength > maxWarnings ) return 1

	return 0
}

/**
 * @description outputs our messages, wipes errs/warnings if watching
 * @returns {Object | Function} returns process exit if not watching, or obj otherwise
 */
var done = function() {
	var warningsOrErrors = []
	var msg = ''

	this.state.exitCode = getExitCode( this.cache.errs.length, this.cache.warnings.length, this.config.maxErrors, this.config.maxWarnings )

	// when testing we want to silence the console a bit, so we have the quiet option
	if ( !this.state.quiet ) {
		warningsOrErrors = [].concat( this.cache.errs, this.cache.warnings ).filter( function( str ) { return !!str } )

		if ( warningsOrErrors.length ) {
			msg = warningsOrErrors.join( '\n\n' ) + '\n'
		}

		msg += '\n' + this.cache.msg

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
		errs: this.cache.errs.slice( 0 ),
		warnings: this.cache.warnings.slice( 0 ),
		exitCode: this.state.exitCode,
		msg: this.cache.msg
	}

	// if watching we reset the errors/warnings arrays
	this.cache.errs = []
	this.cache.warnings = []

	return returnValue
}

module.exports = done
