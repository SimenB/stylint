'use strict';

const eqEndRe = /=$|=\s$/;

/**
 * @description Depending on settings, enforce of disallow @block when defining block vars.
 * @param {Object} context - Linting context.
 * @param {Array<String>} [context.config] - Function to report violations.
 * @param {Function} context.report - Function to report violations.
 * @param {string} context.line - Current line being linted.
 * @returns {void} Nothing.
 */
function blocks(context) {
  const line = context.line;
  const conf = context.conf;
  if (line.indexOf('=') === -1) {
    return;
  }

  let block;
  const index = line.indexOf('@block');

  // if = ends the line and not a block var or hash
  if (index === -1 && eqEndRe.test(line)) {
    block = false;
  } else if (index !== -1) {
    block = true;
  }

  if (conf === 'always' && block === false) {
    context.report({ message: 'block variables must include @block', column: line.length });
  } else if (conf === 'never' && block === true) {
    context.report({ message: '@block is not allowed', column: index });
  }
}

module.exports = blocks;
