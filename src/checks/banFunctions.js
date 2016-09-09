'use strict'


/**
 * @description disallows use of a specific list of key words
 * @param {string} [line] curr line being linted
 * @return {boolean} true if translate3d is used, false if not
 */
var banFunctions = function( line ) {
	var found = false
	var bannedFunctions = this.config['bannedFunctions'] || []
	var index = -1

	bannedFunctions.forEach( function( func ) {
		index = line.indexOf( func )
		if ( index !== -1 ) {
			found = true
			this.msg( func + ' is currently banned', index )
		}
	}.bind( this ) )

	return found
}

module.exports = banFunctions
