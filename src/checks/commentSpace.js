'use strict'

var commentRe = /\/\/ /


/**
 * @description // check for space after line comment
 * @returns {boolean} true if comment found, false if not
 */
var commentSpace = function() {
	if ( !this.state.hasComment ) { return }

	var spaceAfterComment = false

	// check for space after comment on it's own line, if no space, return warning
	if ( commentRe.test( this.cache.comment ) ) {
		spaceAfterComment = true
	}
	var emptyComment = /\/\/$/.test( this.cache.comment )

	if ( this.state.conf === 'always' && spaceAfterComment === false && !emptyComment ) {
		this.msg( 'line comments require a space after //', this.cache.origLine.indexOf( '//' ) )
	}
	else if ( this.state.conf === 'never' && spaceAfterComment === true ) {
		this.msg( 'spaces after line comments disallowed', this.cache.origLine.indexOf( '//' ) )
	}

	return spaceAfterComment
}

module.exports = commentSpace
