'use strict';

// we only want to check semicolons on properties/values
const ignoreRe = /(^[*#.])|[&>/]|{|}|if|for(?!\w)|else|@block|@media|(}|{|=|,)$/igm;

/**
 * @description Check that selector properties are sorted accordingly.
 * @param  {string} [line] - Current line being linted.
 * @returns {boolean} True if in order, false if not.
 */
const semicolons = function (line) {
  if (ignoreRe.test(line.trim())) return;
  if (this.state.hashOrCss) return;

  let semicolon;
  const index = line.indexOf(';');

  if (this.state.conf === 'never' && index !== -1) {
    semicolon = true;
  }

  // for reasons that perplex me, even when the first use
  // of this at the top returns true, sometimes the method
  // still runs, so we add this second ignoreCheck here to catch it
  if (this.state.conf === 'always' && !ignoreRe.test(line.trim())) {
    if (index === -1 &&
      line.indexOf('}') === -1 &&
      line.indexOf('{') === -1) {
      semicolon = false;
    }
  }

  if (this.state.conf === 'never' && semicolon === true) {
    this.msg('unnecessary semicolon found', index);
  }
  else if (this.state.conf === 'always' && semicolon === false) {
    this.msg('missing semicolon', line.length);
  }

  return semicolon;
};

module.exports = semicolons;
