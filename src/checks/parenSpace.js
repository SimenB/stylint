'use strict'

var parensRe = /\(.+\)/
var parensWithSpaceRe = /\(\s+|\s\)+/


/**
 * @description checks for extra space when using parens
 * @param {string} [line] curr line being linted
 * @return {boolean} true if placeholder used, false if not
 */
var parenSpace = function( line ) {
	if ( !parensRe.test( line ) ) { return }

	var hasSpaces = false

	// if mixin exists and it has params
	if ( parensWithSpaceRe.test( line ) ) {
		hasSpaces = true
	}

	if ( this.state.conf === 'always' && hasSpaces === false ) {
		this.msg( '( param1, param2 ) is preferred over (param1, param2)' )
	}
	else if ( this.state.conf === 'never' && hasSpaces === true ) {
		this.msg( '(param1, param2) is preferred over ( param1, param2 )' )
	}

	return hasSpaces
}

module.exports = parenSpace
