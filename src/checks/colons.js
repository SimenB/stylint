'use strict'

var validJSON = require( '../data/valid.json' )
// we only want to check colons on properties/values
var ignoreRe = /( ^[&$=#>.]|\.[a-zA-Z]|#[a-zA-Z]| \+ | , | = | ~ | > | &| {|}|\(|if|for(?!\w)|else|return|@block|@media|@import|@extend|@require|,$)/m

// /( ^[&$=#>.]| \+ | , | = | ~ | > | &| {|}|\(|if|for(?!\w)|else|return|@block|@media|@import|@extend|@require|,$)/m

// /( (^[&$=#>.])| \+ | , | = | ~ | {|}|\(|if|for(?!\w)|else|return|@block|@media|@import|@extend|@require|,$)/m


/**
 * @description check for colons
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if colon found, false if not
 */
var colons = function( line ) {
	if ( ignoreRe.test( line ) || this.state.context === 0 ) { return }

	var colon
	var hasPseudo = false
	var arr = this.splitAndStrip( new RegExp( /\s/ ), line )
	var propertyName = arr[0]

	if ( this.state.conf === 'always' &&
		arr.length > 1 &&
		propertyName.indexOf( ':' ) === -1 ) {
		colon = false
	}
	// : is allowed in hashes
	else if ( !this.state.hash &&
		this.state.conf === 'never' &&
		line.indexOf( ':' ) !== -1 &&
		line.indexOf( 'content' ) === -1 ) {

		// check for pseudo selector first
		hasPseudo = validJSON.pseudo.some( function( val ) {
			return line.indexOf( val ) !== -1
		} )

		if ( !hasPseudo ) {
			colon = true
		}
	}

	if ( this.state.conf === 'always' && colon === false ) {
		this.msg( 'missing colon between property and value', line.indexOf( propertyName ) + propertyName.length )
	}
	else if ( this.state.conf === 'never' && colon === true ) {
		this.msg( 'unecessary colon found', line.indexOf( ':' ) )
	}

	return colon
}

module.exports = colons
