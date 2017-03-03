/* eslint-disable consistent-return */

'use strict';

const fs = require('fs');
const async = require('async');

/**
 * @description Determines what files to read, creates an array of them, and passes it to be parsed.
 * @param {string} [filepath] - Option for manually passing in a filename.
 * @returns {Function} Parse function.
 */
const read = function(filepath) {
  // if user passes in a glob, we forEach over them
  // and pass it into read() as filepath
  const path = filepath || this.state.path;

  // if nothing passed in, default to linting the curr dir
  // here we get all the files to parse first, then we pass to app.parse
  if (path === process.cwd()) {
    return this.getFiles(`${this.state.path}/**/*.styl`);
  }

  // if * is array, assume glob
  if (path instanceof Array) {
    return this.getFiles(this.state.path);
  }

  // else we'll have either a filename or dir name to work with
  // if dir we use the glob logic to return an array of files to test
  return fs.stat(path, (err, stats) => {
    if (!stats || err) {
      throw Error(`Stylint Error: No such file or dir exists!, "${path}"`);
    }

    // if this path matches any regex in the excludes array, we ignore
    const isExcluded = this.state.exclude.some(exclude => {
      if (typeof exclude !== 'string') return false;
      const excludeRegExp = new RegExp(exclude, 'm');
      return excludeRegExp.test(path);
    });

    // you shall not pass
    if (isExcluded) return;

    if (stats.isFile()) {
      this.cache.filesLen = 1;
      this.cache.fileNo = 1;
      this.cache.file = path;
      this.cache.files = [path];
      return async.map(this.cache.files, fs.readFile, this.parse.bind(this));
    }
    if (stats.isDirectory()) {
      return this.getFiles(`${path}/**/*.styl`);
    }
  });
};

module.exports = read;
