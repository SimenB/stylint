'use strict';

const validJSON = require('../data/valid.json');
// we only want to check colons on properties/values
// eslint-disable-next-line max-len
const ignoreRe = /( ^[&$=#>.]|\.[a-zA-Z]|#[a-zA-Z]| \+ | , | = | ~ | > | &| {|}|\(|if|for(?!\w)|else|return|@block|@media|@import|@extend|@require|,$)/m;

/**
 * @description Check for colons
 * @param {string} [line] - Current line being linted.
 * @returns {boolean} True if colon found, false if not.
 */
const colons = function(line) {
  if (ignoreRe.test(line) || this.state.context === 0) {
    return;
  }

  let colon;
  let hasPseudo = false;
  let hasScope = false;
  const arr = this.splitAndStrip(new RegExp(/\s/), line);

  if (
    this.state.conf === 'always' &&
    arr.length > 1 &&
    arr[0].indexOf(':') === -1 &&
    arr[0].indexOf(',') === -1
  ) {
    colon = false;
  } else if (
    !this.state.hash &&
    this.state.conf === 'never' &&
    line.indexOf(':') !== -1
  ) {
    // : is allowed in hashes
    // check for pseudo selector
    hasPseudo = validJSON.pseudo.some(val => line.indexOf(val) !== -1);

    // check for scope selector
    hasScope = validJSON.scope.some(val => line.indexOf(val) !== -1);

    if (!hasPseudo && !hasScope) {
      colon = true;
    }
  }

  if (this.state.conf === 'always' && colon === false) {
    this.msg('missing colon between property and value', arr[0].length);
  } else if (this.state.conf === 'never' && colon === true) {
    this.msg('unnecessary colon found', line.indexOf(':'));
  }

  return colon;
};

module.exports = colons;
