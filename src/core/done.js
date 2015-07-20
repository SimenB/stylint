'use strict'

/**
 * @description outputs our messages, wipes errs/warnings if watching
 * @returns {Object | Function} returns process exit if not watching, or obj otherwise
 */
var done = function() {
	var warningsOrErrors = []
	var msg = ''

	// if no warnings or errors, give clean exit code
	if ( this.cache.errs.length > 0 ||
		this.cache.warnings.length > 0 ) {
		this.state.exitCode = 1
	}

	// when testing we want to silence the console a bit, so we have the quiet option
	if ( !this.state.quiet ) {
		this.cache.errs.forEach( function( err ) {
			return warningsOrErrors.push( err )
		} )

		this.cache.warnings.forEach( function( war ) {
			return warningsOrErrors.push( war )
		} )

		msg = warningsOrErrors.join( '\n\n' )
		msg += '\n' + this.cache.msg

		if ( msg.trim() ) {
			console.log( msg )
		}
	}

	// dont kill the linter if watch is watchin
	// else theres no more to do, so exit the process
	if ( !this.state.watching ) {
		return process.exit( this.state.exitCode )
	}

	// if watching we reset the errors/warnings arrays
	this.cache.errs = []
	this.cache.warnings = []
	return {
		exitCode: this.state.exitCode,
		msg: this.cache.msg
	}
}

module.exports = done
