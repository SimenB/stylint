'use strict';

// check if we're defining keyframe animations, which have some special rules
module.exports = function keyframeEnd( line ) {
	var isKeyframeOver = false;

	if ( this.state.keyframes && this.state.context === 0 ) {
		isKeyframeOver = true;
	}

	return isKeyframeOver;
};
