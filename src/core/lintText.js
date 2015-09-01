'use strict'

var groupBy = require( 'lodash.groupby' )

/**
 * @description wrapper for parse for programmatic use
 * @param {String} string the text to parse
 * @param {Object} [config] an object containing config to lint by
 * @param {String} [filename] the name of the file
 * @returns {Object} an object containing an array of all violations and total number of warnings/errors in the given string
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

	this.cache.files = [filename]

	this.parse( null, [string], true )

	var results = this.cache.allViolations.slice( 0 ) // a copy of all violations
	var warningsOrErrors = groupBy( results, 'severity' )

	return {
		results: results,
		numOfErrors: warningsOrErrors.Error ? warningsOrErrors.Error.length : 0,
		numOfWarnings: warningsOrErrors.Warning ? warningsOrErrors.Warning.length : 0
	}
}

module.exports = lintText
