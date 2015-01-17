'use strict';

var
    chalk    = require('chalk'),
    chokidar = require('chokidar');

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
        return console.log( chalk.blue('Watching: '), path, ' for changes.' );
    });

    // listen for changes, update 'dir' to curr file, do somethin
    watcher.on('change', function( newPath ) {
        app.state.dir = newPath;
        return app.read( app, newPath );
    });
}