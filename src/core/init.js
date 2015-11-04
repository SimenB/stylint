'use strict'

var defaults = require( 'lodash.defaults' )

var defaultOptions = {
	watch: false,
	config: null,
	strict: false
}

/**
 * @description initialization function, does routing and kicks it all off
 * @param {Object} [options] options passed to stylint
 * @param {String} [pathPassed] path to files to lint
 * @return {Function} always returns a function, determined by cli flags
 */
var init = function( options, pathPassed ) {
	options = defaults( options || {}, defaultOptions )

	this.config = this.setConfig( options.config )

	// make sure indentPref is set no matter what
	this.config.indentPref = this.config.indentPref || false

	// if you want to use transparent mixins, pass in an array of them
	this.cache.mixins = this.config.mixins || this.cache.mixins

	// we do the check here just in case
	// they don't pass in a reporter when using a custom config
	if ( this.config.reporter ) {
		this.reporter = require( this.config.reporter )
	}
	else {
		this.reporter = require( './reporter' )
	}

	// if path/ passed in use that for the dir
	this.state.path = pathPassed || this.state.path || process.cwd()

	// fire watch or read based on flag
	if ( options.watch ) {
		return this.watch()
	}

	return this.read()
}

module.exports = init
