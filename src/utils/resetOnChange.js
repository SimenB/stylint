'use strict';

/**
 * @description brittle function that just resets a bunch of caches when watch is running
 * @param {string} [newPath] if touching a new file, lint it
 * @returns {Function} kick off linter again
*/
// eslint-disable-next-line consistent-return
const resetOnChange = function (newPath) {
  this.state.path = newPath || this.state.path;
  this.cache.alphaCache = [];
  this.cache.rootCache = [];
  this.cache.zCache = [];
  this.cache.messages = [];
  this.cache.prevLine = '';
  this.cache.prevFile = '';
  this.cache.prevContext = 0;
  this.cache.report = {};
  this.cache.sCache = {};
  this.cache.sortOrderCache = [];

  if (this.state.watching) {
    return this.read();
  }
};

module.exports = resetOnChange;
