'use strict'


/**
 * @description checks that the # of spaces used is consistent
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if # of spaces correct, false if not
 */
var indentPref = function( line ) {
	if ( typeof this.state.conf !== 'number' ) { return }

	var indentCorrect = true

	console.log( this.state.context )
	console.log( this.state.context % 1 == 0 )

	if ( this.state.context % 1 !== 0 ) {
		indentCorrect = false
	}

	// if ( this.state.conf === '@extends' &&
	// 	line.indexOf( '@extends ' ) === -1 ) {

	// 	indentCorrect = true
	// }
	// // else @extend is your pref
	// else if ( this.state.conf === '@extend' &&
	// 	line.indexOf( '@extend ' ) === -1 ) {

	// 	indentCorrect = true
	// }

	if ( indentCorrect === false ) {
		this.msg( 'incorrect # of spaces for indent, use ' + this.state.conf )
	}

	return indentCorrect
}

module.exports = indentPref
