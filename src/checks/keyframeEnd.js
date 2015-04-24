'use strict';

// check if we're defining keyframe animations, which have some special rules
module.exports = function keyframeEnd( line ) {
	if ( typeof line !== 'string' ) { return; }
	var isKeyframeOver = false;

	// @TODO soo redundant...
	var arr = line.split(/[\s\t]/);
	var textIndex = 0;
	var indentCount = 0;
	var currContext = 0;

	// quick and dirty fixes for now, didnt' account for hard tabs for context check
	// this just gets the number of indents so we don't throw false positives
	if ( typeof this.config.indentSpaces !== 'number' ) {
		while ( line.charAt( textIndex++ ) === '\t' ) {
			currContext++;
		}
	}
	else {
		arr.forEach(function( val, i ) {
			if ( arr[i].length === 0 ) {
				indentCount++; // spaces or tabs
			}
			else {
				currContext = indentCount / this.config.indentSpaces;
			}
		}.bind( this ));
	}

	// console.log( this );

	if ( this.state.keyframes && currContext === 0 ) {
		isKeyframeOver = true;
	}

	return isKeyframeOver;
};
