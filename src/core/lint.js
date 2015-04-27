'use strict';

/**
 * @description runs tests according to config ( or all if strict is true )
 * @return void
 */
module.exports = function lint() {
	var cache = this.cache;
	var state = this.state;
	var lintMethods = this.__proto__.lintMethods;

	// @TODO methods that will determine state should go here
	// checks stuff like if a stylint toggle is on or off, whether we're in a hash, etc
	for ( var method in lintMethods ) {
		if ( lintMethods.hasOwnProperty( method ) ) {
			if ( this.config[method] || this.state.strictMode ) {
				lintMethods[method].call(this, this.cache.line);
				// console.log(lintMethods[method])
			}
		}
	}

	// save our curr context so we can use it next time
	this.cache.prevFile = this.cache.file;
	this.cache.prevLine = this.cache.line;
};
