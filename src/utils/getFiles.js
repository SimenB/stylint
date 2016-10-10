'use strict';

const fs = require('fs');
const glob = require('glob');
const async = require('async');
const path = require('path');

/**
 * @description globs files and returns an array, used in various methods
 * @param {string} [dir] directory of files to glob
 * @returns {Array} returns an array of files
 */
const getFiles = function (dir) {
  if (typeof dir !== 'string' && !(dir instanceof Array)) {
    throw new TypeError(`getFiles err. Expected string or array, but received: ${typeof dir}`);
  }

  if (typeof dir === 'string') {
    return glob(dir, {}, (err, files) => {
      if (err) {
        throw err;
      }

      const filteredFiles = files.filter(file => {
        let excluded = false;
        const relPath = path.relative(dir.replace('/**/*.styl', ''), file);

        this.config.exclude.forEach(exclude => {
          excluded = excluded || exclude.match(relPath);
        });

        return !excluded;
      });

      this.cache.filesLen = filteredFiles.length - 1;
      this.cache.files = filteredFiles;

      return async.map(this.cache.files, fs.readFile, this.parse.bind(this));
    });
  } else if (dir instanceof Array) {
    const files = dir.filter(function (filepath) {
      let excluded = false;

      this.config.exclude.forEach(exclude => {
        excluded = excluded || exclude.match(filepath);
      });

      return !excluded;
    }, this);

    this.cache.filesLen = files.length - 1;
    this.cache.files = files;
    return this.cache.files.map(file => this.read(file));
  }

  throw new Error('Input not a string or array');
};

module.exports = getFiles;
