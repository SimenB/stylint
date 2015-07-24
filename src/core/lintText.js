'use strict'

/**
 * @description wrapper for parse for programmatic use
 * @param {String} string the text to parse
 * @param {Object} [config] an object containing config to lint by
 * @param {String} [filename] the name of the file
 * @returns {Array} an array of all violations in the given string
 */
var lintText = function( string, config, filename ) {
	// reset stuff
	this.resetOnChange()

	if ( config ) {
		this.init( { config: config } )
	}

	// make sure there is no output to the console
	this.state.quiet = true

	// don't kill process
	this.state.watching = true

	// never kill the linter
	this.config.maxErrors = null
	this.config.maxWarnings = null

	this.cache.file = filename

	this.parse( null, [string] )

	return this.cache.allViolations.slice( 0 ) // return a copy of all violations
}

module.exports = lintText
