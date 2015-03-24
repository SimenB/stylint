'use strict';

var chokidar = require('chokidar');

/**
 * kicks off the app. sets up config and kicks off reading the files
 * @param  {string} dir          [dir | filename | 'nothing']
 * @param  {string} customConfig [path to config object]
 * @return {function}            [kick off linter on each change]
 */
module.exports = function watch( app, path ) {
	if ( typeof path === 'undefined' ) { return; }
	var watcher = chokidar.watch( path );

	// initial watch msg
	watcher.on('ready', function() {
		app.state.watching = true;
		return console.log( 'Watching: ', path, ' for changes.' );
	});

	// listen for changes, update 'dir' to curr file, wipe all the caches, do somethin
	watcher.on('change', function( newPath ) {
		app.state.dir = newPath;
		app.cache.warnings = [];
		app.cache.alphaCache = [];
		app.cache.selectorCache = [];
		app.cache.rootCache = [];
		app.cache.zCache = [];
		app.cache.prevLine = '';
		app.cache.prevFile = '';
		app.cache.prevContext = 0;
		return app.read( app, newPath );
	});
}
