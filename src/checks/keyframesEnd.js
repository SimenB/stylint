'use strict';

// check if we're defining keyframe animations, which have some special rules
module.exports = function keyframesEnd(line) {
	if ( !this.state.keyframes ) { return; }

	if ( this.state.keyframes && this.state.context === '0' ) {
		this.state.keyframes = false;
	}

	return this.state.keyframes;
};
