'use strict'


/**
 * @description disallows use of a specific list of key words
 * @param {string} [line] curr line being linted
 * @return {boolean} true if function is banned, false if not
 */
var bannedFunctions = function( line ) {
	var found = false
	var bannedFunctionList = this.config.bannedFunctions || []
	var index = -1

	bannedFunctionList.forEach( function( func ) {
		index = line.indexOf( func )
		if ( index !== -1 ) {
			found = true
			this.msg( 'unexpected banned function ' + func + ' encountered', index )
		}
	}.bind( this ) )

	return found
}

module.exports = bannedFunctions
