'use strict'


/**
 * @description separate out line comments and remove interpolation
 * @param {string} [line] curr line being linted
 * @returns {string} the line, but minus all the annoying stuff
*/
var trimLine = function( line ) {
	var startsWithCommentRe = /(^\/\/)/
	this.state.hasComment = false
	this.cache.comment = ''

	// strip line comments
	if ( line.indexOf( '//' ) !== -1 ) {
		this.state.hasComment = true
		this.cache.comment = line.slice( line.indexOf( '//' ), line.length )

		if ( !startsWithCommentRe.test( line.trim() ) ) {
			line = line.slice( 0, line.indexOf( '//' ) - 1 )
		}
	}

	// strip interpolated variables
	// and the content inside quotes
	return line.replace( /( *{\S+} *)/, '' )
}

module.exports = trimLine
