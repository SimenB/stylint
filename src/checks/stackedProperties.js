'use strict'

/**
 * @description disallow one-liners
 * @param  {string} [line] curr line being linted
 * @return {boolean} true if one-liner found, false if not
 */
var stackedProperties = function( line ) {
	var oneLiner = false
	var arr = this.splitAndStrip( ';', line.trim() )

	if ( arr && arr.length > 1 ) {
		oneLiner = true
	}

	if ( this.state.conf === 'never' && oneLiner ) {
		this.msg( 'avoid one liners. put properties on their own line' )
	}

	return oneLiner
}

module.exports = stackedProperties
