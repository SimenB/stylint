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

	var indexOfCss = line.indexOf( '@css' );
    if ( indexOfCss !== -1 ) {
		isCSSLiteral = true
	}

	if ( this.state.conf === 'never' && isCSSLiteral === true ) {
		this.msg( 'css literals are disallowed', indexOfCss )
	}

	return isCSSLiteral
}

module.exports = cssLiteral
