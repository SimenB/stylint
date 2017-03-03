'use strict';

const urlOrContentRe = /(["'].+["'])|( +|:)url\(.+\)/;

/**
 * @description Separate out line comments.
 *              Strip out interpolation.
 *              Strip out url and content strings.
 * @param {string} [line] - Curr line being linted.
 * @returns {string} The line, but minus all the annoying stuff.
 */
const trimLine = function(line) {
  const startsWithCommentRe = /(^\/\/)/;

  // reset values from previous line
  this.state.hasComment = false;
  this.cache.comment = '';

  // remove urls, content strings
  let noUrl = line.replace(urlOrContentRe, ' ');

  // strip line comments, if any exist after stripping urls
  if (noUrl.indexOf('//') !== -1) {
    // a for real line comment, no http:// false positive
    this.state.hasComment = true;
    // separate out line comment for spacing check
    this.cache.comment = noUrl.slice(noUrl.indexOf('//'), noUrl.length);

    // if this line comment is at the end of the line
    if (!startsWithCommentRe.test(noUrl.trim())) {
      noUrl = noUrl.slice(0, noUrl.indexOf('//') - 1);
    }
  }

  // strip interpolated variables
  return noUrl.replace(/( *{ *\S+ *} *)/, '');
};

module.exports = trimLine;
