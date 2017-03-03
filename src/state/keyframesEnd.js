'use strict';

/**
 * @description Check for keyframes end.
 * @returns {boolean} False if keyframes ending, true if not.
 */
const keyframesEnd = function() {
  if (!this.state.keyframes) {
    return;
  }

  if (this.state.keyframes && this.state.context === 0) {
    this.state.keyframes = false;
  }

  return this.state.keyframes;
};

module.exports = keyframesEnd;
