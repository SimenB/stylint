'use strict'

var extendRe = /@extends?\s/
var placeholderRe = /(\$[^,;\s]*)/
var nonPlaceholderRe = /([\.|#][^,;\s]*)/


/**
 * @description check that @extend is only used with a $placeholderVar
 * @param {string} [line] curr line being linted
 * @return {boolean} true if placeholder used, false if not
 */
var placeholders = function( line ) {
	if ( line.indexOf( '@extend' ) === -1 ) { return }

	if ( !extendRe.test( line ) ) {
		return false
	}

	if ( this.state.conf === 'always' && nonPlaceholderRe.test( line ) ) {
		this.msg( 'use a placeholder variable when extending', line.search( nonPlaceholderRe ) )
	}
	else if ( this.state.conf === 'never' && placeholderRe.test( line ) ) {
		this.msg( 'placeholder variables are disallowed', line.search( placeholderRe ) )
	}

	return placeholderRe.test( line )
}

module.exports = placeholders
