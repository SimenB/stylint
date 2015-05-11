'use strict';

/**
 * @description runs tests according to config ( or all if strict is true )
 * @return void
 */
module.exports = function lint() {
	var cache = this.cache;
	var state = this.state;
	var checks = this.__proto__.lintMethods;


	// @TODO methods that will determine state should go here
	// checks stuff like if a stylint toggle is on or off, whether we're in a hash, etc
	for ( var method in checks ) {
		if ( checks.hasOwnProperty( method ) ) {
			if ( this.config[method] || this.state.strictMode ) {
				checks[method].call(this, this.cache.line);

				if ( this.config.maxWarningsKill && cache.warnings.length > this.config.maxWarnings ) {
					return this.done('kill');
				}
			}
		}
	}

	// save our curr context so we can use it next time
	this.cache.prevFile = this.cache.file;
	this.cache.prevLine = this.cache.line;
};
