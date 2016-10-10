'use strict';

const keyframeRe = /@(?:-(?:[\w\d]+-)*)?keyframes/;

/**
 * @description Check for keyframes, which have some special rules.
 * @param {string} [line] - Current line being linted.
 * @returns {boolean} True if keyframes starting, false if not.
 */
const keyframesStart = function (line) {
  if (this.state.keyframes || !this.state.testsEnabled) {
    return;
  }

  if (keyframeRe.test(line)) {
    this.state.keyframes = true;
  }

  return this.state.keyframes;
};

module.exports = keyframesStart;
