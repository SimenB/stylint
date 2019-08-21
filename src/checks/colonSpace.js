'use strict'

var validJSON = require( '../data/valid.json' )
// we only want to check colons on properties/values
var ignoreRe = /( ^[&$=#>.]|\.[a-zA-Z]|#[a-zA-Z]| \+ | , | = | ~ | > | &| {|}|\(|if|for(?!\w)|else|return|@block|@media|@import|@extend|@require|,$)/m

/**
 * @description if set to always, enforces spaces after colons. if set to never, disallows spaces
 * @param {string} [line] curr line being linted
  * @param {string} [origLine] curr line before being stripped
 * @returns {boolean} true if space missing, false if not
 */
var colonSpace = function( line, origLine ) {
	if ( ignoreRe.test( origLine ) || this.state.context === 0 || origLine.indexOf( ':' ) === -1 ) { return }

	var hasSpace
	var hasPseudo = false
	var hasScope = false
	var arr = this.splitAndStrip( new RegExp( /\s/ ), origLine )

	if ( this.state.conf === 'always' || this.state.conf === 'never' ) {
		// check for pseudo selector
		hasPseudo = validJSON.pseudo.some( function( val ) {
			return origLine.indexOf( val ) !== -1
		} )

		// check for scope selector
		hasScope = validJSON.scope.some( function( val ) {
			return origLine.indexOf( val ) !== -1
		} )

		if ( !hasPseudo && !hasScope ) {
			hasSpace = arr.length > 1 && arr[0].indexOf( ':' ) === arr[0].length - 1
		}
	}

	// if spaces should be follow commas, but there is no space on the line
	if ( this.state.conf === 'always' && hasSpace === false ) {
		this.msg( 'colons must be followed by a space for readability', origLine.indexOf( ':' ) )
	}
	// if spaces should not be followed by a comma, but there are spaces anyway
	else if ( this.state.conf === 'never' && hasSpace === true ) {
		this.msg( 'spaces after colons are not allowed', origLine.indexOf( ':' ) )
	}

	return hasSpace
}

module.exports = colonSpace
