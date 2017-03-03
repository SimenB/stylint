'use strict';

const chokidar = require('chokidar');

/**
 * @description Kicks off the app. sets up config and kicks off reading the files.
 * @returns {Function} Kick off linter on each change.
 */
const watch = function() {
  this.watcher = chokidar.watch(this.state.path);

  // initial watch msg
  this.watcher.on('ready', () => {
    this.state.watching = true;
    // eslint-disable-next-line no-console
    console.log('Watching: ', this.state.path, ' for changes.');
  });

  // listen for changes, update 'dir' to curr file, wipe all the caches, do something
  this.watcher.on('change', this.resetOnChange.bind(this));
};

module.exports = watch;
