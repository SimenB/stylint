'use strict';

const parensRe = /\(.+\)/;
const parensBeginWithSpaceRe = /\(\s+/;
const parensEndWithSpaceRe = /\s+\)+/;
const parensBeginWithNoSpaceRe = /\(\S+/;
const parensEndWithNoSpaceRe = /\S+\)+/;


/**
 * @description checks for extra space when using parens
 * @param {string} [line] curr line being linted
 * @param {string} [source] curr line before being stripped
 * @return {boolean} true if placeholder used, false if not
 */
const parenSpace = function (line, source) {
  if (!parensRe.test(source)) { return; }

  const hasStartSpace = parensBeginWithSpaceRe.exec(source);
  const hasEndSpace = parensEndWithSpaceRe.exec(source);
  let index;
  let missingStartSpace;
  let missingEndSpace;

  if (this.state.conf === 'always' && (!hasStartSpace || !hasEndSpace)) {
    missingStartSpace = parensBeginWithNoSpaceRe.exec(source);
    missingEndSpace = parensEndWithNoSpaceRe.exec(source);
    index = missingStartSpace && missingStartSpace.index;

    if (!index && missingEndSpace) {
      index = missingEndSpace.index;
    }

    this.msg('( param1, param2 ) is preferred over (param1, param2)', index);
  }
  else if (this.state.conf === 'never' && (hasStartSpace || hasEndSpace)) {
    index = hasStartSpace && hasStartSpace.index;

    if (!index && hasEndSpace) {
      index = hasEndSpace.index;
    }

    this.msg('(param1, param2) is preferred over ( param1, param2 )', index);
  }

  return hasStartSpace && hasEndSpace;
};

module.exports = parenSpace;
