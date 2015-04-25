'use strict';

// check if we're defining keyframe animations, which have some special rules
module.exports = function keyframeStart( line ) {
	if ( typeof line !== 'string' ) { return; }
	var isKeyframe = false;

	if ( line.indexOf('@keyframe') !== -1 ) {
		isKeyframe = true;
	}

	return isKeyframe;
};
