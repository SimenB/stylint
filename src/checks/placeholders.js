'use strict'

var placeholderRe = /(@extend|@extends)+( \$)+/


/**
 * @description check that @extend is only used with a $placeholderVar
 * @param {string} [line] curr line being linted
 * @return {boolean} true if placeholder used, false if not
 */
var placeholders = function( line ) {
	if ( line.indexOf( '@extend' ) === -1 ) { return }

	var placeholder = false

	// first check if line has an extend, then check for placeholder
	if ( placeholderRe.test( line ) ) {
		placeholder = true
	}

	if ( this.state.conf === 'always' && placeholder === false ) {
		this.msg( 'use a placeholder variable when extending' )
	}
	else if ( this.state.conf === 'never' && placeholder === true ) {
		this.msg( 'placeholder variables are disallowed' )
	}

	return placeholder
}

module.exports = placeholders
