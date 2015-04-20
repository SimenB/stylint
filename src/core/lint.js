'use strict';

/**
 * @description runs tests
 * @param  {string} line      [the curr line being tested, in its original form]
 * @param  {number} num       [line number being tested]
 * @param  {string} output    [trimmed line to output]
 * @param  {string} file      [name of file being tested]
 * @return void
 */
module.exports = function lint() {
	var cache = this.cache;
	var state = this.state;
	var lintMethods = this.__proto__.lintMethods;

	// @TODO methods that will determine state should go here
	// checks stuff like if a stylint toggle is on or off, whether we're in a hash, etc

	// runs all tests
	for ( var method in lintMethods ) {
		if ( lintMethods.hasOwnProperty( method ) ) {
			if ( this.config[method] || this.state.strictMode ) {
				lintMethods[method].call(this, this.cache.line);
			}
		}
	}

	// process.exit();

	// console.log( 'i should be called' );

	// console.log( app.cache );
	// console.log( app.cache.warnings );

	// return app.core.done( app );
};
