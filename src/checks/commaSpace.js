'use strict';

// if , is present on line and its not followed by a space
const noSpaceRe = /,\S/;
const withSpaceRe = /,\s/;
const removeQuotesRe = /(["'])(?:(?=(\\?))\2.)*?\1/g;

/**
 * @description If set to always, enforces spaces after commas. If set to never, disallows spaces.
 * @param {string} [line] - Current line being linted.
 * @param {string} [source] - Current line before being stripped.
 * @returns {boolean} True if space missing, false if not.
 */
const commaSpace = function(line, source) {
  // conditions where testing isn't needed.
  // 1: no comma on line at all
  // 2: comma ends the line, as in a list
  // 3: comma is
  if (
    source.indexOf(',') === -1 ||
    source.trim().indexOf(',') === source.length - 1
  ) {
    return;
  }

  // just strip content between quotes, leave rest of syntax intact
  // this is so we don't get false positives with , in strings
  const trimmedLine = source.replace(removeQuotesRe, '""').trim();

  const noSpace = noSpaceRe.exec(trimmedLine);
  const hasSpace = withSpaceRe.exec(trimmedLine);

  // if spaces should be follow commas, but there is no space on the line
  if (this.state.conf === 'always' && noSpace) {
    this.msg(
      'commas must be followed by a space for readability',
      noSpace.index
    );
  } else if (this.state.conf === 'never' && hasSpace) {
    // if spaces should not be followed by a comma, but there are spaces anyway
    this.msg('spaces after commas are not allowed', hasSpace.index);
  }

  return !!(noSpace && !hasSpace);
};

module.exports = commaSpace;
