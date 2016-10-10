'use strict';

/**
 * @description check for keyframes end
 * @returns {boolean} false if keyframes ending, true if not
 */
const keyframesEnd = function () {
  if (!this.state.keyframes) {
    return;
  }

  if (this.state.keyframes && this.state.context === 0) {
    this.state.keyframes = false;
  }

  return this.state.keyframes;
};

module.exports = keyframesEnd;
