'use strict'


/**
 * @description if we disallowed css literals, check for them and return true if found
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if @css found, false if not
 * @TODO do i still work with setState?
 */
var cssLiteral = function( line ) {
	if ( this.state.hashOrCSS ) { return }
	var isCSSLiteral = false

	if ( line.indexOf( '@css' ) !== -1 ) {
		isCSSLiteral = true
	}

	if ( this.state.conf === 'never' && isCSSLiteral === true ) {
		this.msg( 'css literals are disallowed' )
	}

	return isCSSLiteral
}

module.exports = cssLiteral
