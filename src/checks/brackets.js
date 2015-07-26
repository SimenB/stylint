'use strict'

// var selRe = /^[#.]+/
var commaRe = /,$/
var stripRe = /(?=\S)\[\S+\]|(\.|#)\w+/
var validJSON = require( '../data/valid.json' )


/**
 * @description check for brackets
 * @param {string} [line] curr line being linted
 * @returns {boolean | undefined} true if bracket found, false if not, undefined if we skip
 */
var brackets = function( line ) {
	if ( this.state.hashOrCSS || commaRe.test( line ) ) { return }

	var arr = ['hint']
	var isCSS = false
	var bracket = false

	if ( this.state.conf === 'never' ) {
		// ex: $hash = { is ok but .class = { is not
		if ( line.indexOf( '{' ) !== -1 && line.indexOf( '=' ) === -1 ) {
			bracket = true
		}
		// ex: } is okay if ending a hash. otherwise it is NOT okay
		else if ( line.indexOf( '}' ) !== -1 ) {
			bracket = true
		}
	}
	else if ( this.state.conf === 'always' ) {
		arr = this.splitAndStrip( new RegExp( /[\s\t,:]/ ), line )

		if ( typeof arr[0] !== 'undefined' ) {
			arr[0] = arr[0].replace( stripRe, '' ).trim()

			isCSS = validJSON.css.some( function( css ) {
				return arr[0] === css || this.checkPrefix( arr[0], css, validJSON )
			}.bind( this ) )
		}

		// basically, we don't care about properties like margin or padding
		if ( isCSS ) { return }

		// ex: $hash = { is ok but .class = { is not
		if ( line.indexOf( '{' ) !== -1 && line.indexOf( '=' ) === -1 ) {
			bracket = true
			this.state.openBracket = true
		}
		// ex: } is okay if ending a hash. otherwise it is NOT okay
		else if ( line.indexOf( '}' ) !== -1 && this.state.openBracket ) {
			bracket = true
			this.state.openBracket = false
		}
	}

	if ( this.state.conf === 'never' && bracket === true ) {
		this.msg( 'unecessary bracket' )
	}
	else if ( this.state.conf === 'always' && bracket === false ) {
		this.msg( 'always use brackets when defining selectors' )
	}

	return bracket
}

module.exports = brackets
