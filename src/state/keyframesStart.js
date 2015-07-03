'use strict'


/**
 * @description check for keyframes, which have some special rules
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if keyframes starting, false if not
 */
var keyframesStart = function( line ) {
	if ( this.state.keyframes ) { return }

	if ( line.indexOf( '@keyframe' ) !== -1 ) {
		this.state.keyframes = true
	}

	return this.state.keyframes
}

module.exports = keyframesStart
