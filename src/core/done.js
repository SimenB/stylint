'use strict'

/**
 * @description outputs our messages, wipes errs/warnings if watching
 * @returns {Object | Function} returns process exit if not watching, or obj otherwise
 */
var done = function() {
	var warningsOrErrors = []
	var msg = ''

	// if no errors, give clean exit code
	if ( this.cache.errs.length > 0 ) {
		this.state.exitCode = 1
	}

	// when testing we want to silence the console a bit, so we have the quiet option
	if ( !this.state.quiet ) {
		warningsOrErrors = [].concat( this.cache.errs, this.cache.warnings ).filter( function( str ) { return !!str } )

		if ( warningsOrErrors.length ) {
			msg = warningsOrErrors.join( '\n\n' ) + '\n'
		}

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
