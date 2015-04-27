'use strict';

// check if we're defining keyframe animations, which have some special rules
module.exports = function keyframesStart( line ) {
	if ( this.state.keyframes ) { return; }

	if ( line.indexOf('@keyframe') !== -1 ) {
		this.state.keyframes = true;
	}

	return this.state.keyframes;
};
