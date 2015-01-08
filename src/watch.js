const chokidar = require('chokidar'); // better file watching than fs.watch

/**
 * kicks off the app. sets up config and kicks off reading the files
 * @param  {string} dir          [dir | filename | 'nothing']
 * @param  {string} customConfig [path to config object]
 * @return {function}            [kick off linter on each change]
 */
module.exports = function watch() {
    'use strict';
    var app = this,
        watcher = chokidar.watch( app.state.dir );

    // initial watch msg
    watcher.on('ready', function() {
        console.log( app.chalk.blue('Watching: '), app.state.dir, ' for changes.' );
    });

    // listen for changes, update 'dir' to curr file, do somethin
    watcher.on('change', function( path ) {
        app.state.dir = path;
        return app.read();
    });
}