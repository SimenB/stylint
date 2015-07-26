'use strict'

/**
 * @description runs tests according to config ( or all if strict is true )
 * @return {Function | undefined} undefined if just calling the method, function is linting over
 */
var lint = function() {
	var method = ''
	var checks = Object.getPrototypeOf( this ).lintMethods

	for ( method in checks ) {
		if ( checks.hasOwnProperty( method ) ) {
			if ( this.config[method] ) {
				// state.conf === 'always' || 'never' || etc
				this.state.conf = this.config[method].expect || this.config[method]
				// state.severity === 'error' || 'warning'
				this.state.severity = this.config[method].error ? 'Error' : 'Warning'
				// run the actual check against the line
				checks[method].call( this, this.cache.line )
			}
		}
	}

	// save our curr context so we can use it next time
	// this.cache.prevFile = this.cache.file
	this.cache.prevLine = this.cache.line
}

module.exports = lint
