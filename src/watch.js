'use strict';

var chokidar = require('chokidar');

/**
 * kicks off the app. sets up config and kicks off reading the files
 * @param  {string} dir          [dir | filename | 'nothing']
 * @param  {string} customConfig [path to config object]
 * @return {function}            [kick off linter on each change]
 */
module.exports = function watch( app, path ) {
	if ( typeof app !== 'object' ||
		typeof path !== 'string' ) {
		return;
	}

	var watcher = chokidar.watch( path );

	// initial watch msg
	watcher.on('ready', function() {
		app.state.watching = true;
		return console.log( 'Watching: ', path, ' for changes.' );
	});

	// listen for changes, update 'dir' to curr file, wipe all the caches, do somethin
	watcher.on('change', app.resetOnChange.bind(this) );
};
