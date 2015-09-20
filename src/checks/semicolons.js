'use strict'

// we only want to check semicolons on properties/values
var ignoreRe = /(^[&$=#>.])|{|}|if|for(?!\w)|else|@block|@media|=$|=\s|,$|}$|{$/gm


/**
 * @description check that selector properties are sorted accordingly
 * @param  {string} [line] curr line being linted
 * @return {boolean} true if in order, false if not
 */
var semicolons = function( line ) {
	if ( ignoreRe.test( line ) || this.state.hashOrCss ) {
		return
	}

	var semicolon

	if ( this.state.conf === 'never' &&
		line.indexOf( ';' ) !== -1 ) {
		semicolon = true
	}
	else if ( this.state.conf === 'always' &&
		this.state.context > 0 ) {

		if ( line.indexOf( ';' ) === -1 &&
			line.indexOf( '}' ) === -1 &&
			line.indexOf( '{' ) === -1 ) {

			semicolon = false
		}
	}

	if ( this.state.conf === 'never' && semicolon === true ) {
		this.msg( 'unecessary semicolon found' )
	}
	else if ( this.state.conf === 'always' && semicolon === false ) {
		this.msg( 'missing semicolon' )
	}

	return semicolon
}

module.exports = semicolons
