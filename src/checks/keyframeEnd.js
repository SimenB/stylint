'use strict';

// check if we're defining keyframe animations, which have some special rules
module.exports = function keyframeEnd( line ) {
	if ( typeof line !== 'string' ) { return; }
	var context = this.getContext(line);
	var isKeyframeOver = false;

	if ( this.state.keyframes && context === 0 ) {
		isKeyframeOver = true;
	}

	return isKeyframeOver;
};
