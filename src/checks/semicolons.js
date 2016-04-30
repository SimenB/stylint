'use strict'

// we only want to check semicolons on properties/values
var ignoreRe = /(^[#.])|[&$=>]|{|}|if|for(?!\w)|else|@block|@media|=$|=\s|(}|{)$/igm
// for some reason the prev regex matches in regexr
// but isn't matching here
var listRe = /,$/m


/**
 * @description check that selector properties are sorted accordingly
 * @param  {string} [line] curr line being linted
 * @return {boolean} true if in order, false if not
 */
var semicolons = function( line ) {
	if ( ignoreRe.test( line.trim() ) ) return
	if ( listRe.test( line ) ) return
	if ( this.state.hashOrCss ) return

	var semicolon

	var indexOfSemicolon = line.indexOf( ';' )
	if ( this.state.conf === 'never' &&
		indexOfSemicolon !== -1 ) {
		semicolon = true
	}
	else if ( this.state.conf === 'always' &&
		this.state.context > 0 ) {

		if ( indexOfSemicolon === -1 &&
			line.indexOf( '}' ) === -1 &&
			line.indexOf( '{' ) === -1 ) {

			semicolon = false
		}
	}

	if ( this.state.conf === 'never' && semicolon === true ) {
		this.msg( 'unecessary semicolon found', indexOfSemicolon )
	}
	else if ( this.state.conf === 'always' && semicolon === false ) {
		this.msg( 'missing semicolon', line.length )
	}

	return semicolon
}

module.exports = semicolons
