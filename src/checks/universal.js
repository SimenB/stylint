'use strict'

// checks if * is a valid use case or not
var universalRe = /( |\w|\d|'|"|\*|\/)(\*)( |\w|\d|'|"|\*|\$|\=)/

/**
* @description check for * selector.
* technically this is used as part of resets often, for good reason, despite its slowness
* which is why i'm setting it up as a warning as it won't break code but maybe you prefer to not use it
* @param {string} [line] current line being linted
* @returns {boolean} true if * on line, false if not
*/
var universal = function( line ) {
	var hasUniversal = false

	// content can have a string that could be anything, so ignore those
	if ( line.indexOf( '*' ) !== -1 && line.indexOf( 'content' ) === -1 ) {
		if ( !universalRe.test( line ) ) {
			hasUniversal = true
		}
	}

	if ( this.state.conf === 'never' && hasUniversal === true ) {
		this.msg( '* selector is disallowed' )
	}

	return hasUniversal
}

module.exports = universal
