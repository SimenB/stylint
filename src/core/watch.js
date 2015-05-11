'use strict';

var chokidar = require('chokidar');

/**
 * kicks off the app. sets up config and kicks off reading the files
 * @param  {string} dir          [dir | filename | 'nothing']
 * @param  {string} customConfig [path to config object]
 * @return {function}            [kick off linter on each change]
 */
module.exports = function watch() {
	this.watcher = chokidar.watch( this.state.path );

	// initial watch msg
	this.watcher.on('ready', function() {
		this.state.watching = true;
		return console.log( 'Watching: ', this.state.path, ' for changes.' );
	}.bind(this));

	// listen for changes, update 'dir' to curr file, wipe all the caches, do somethin
	this.watcher.on('change', this.resetOnChange.bind(this) );
};
