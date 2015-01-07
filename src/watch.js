const
    chalk       = require('chalk'),
    chokidar    = require('chokidar'); // better file watching than fs.watch


/**
 * kicks off the app. sets up config and kicks off reading the files
 * @param  {string} dir          [dir | filename | 'nothing']
 * @param  {string} customConfig [path to config object]
 * @return {function}            [kick off linter on each change]
 */
module.exports = function watch() {
    var app = this,
        watcher;

    // default to linting the current dir if nothing passed.
    if ( this.flags.indexOf( this.state.dir ) !== -1 ) {
        watcher = chokidar.watch('.');
    }
    // else just lint what was passed
    else {
        watcher = chokidar.watch( this.state.dir );
    }

    // initial watch msg
    watcher.on('ready', function() {
        // watching: dir or file for changes
        if ( app.flags.indexOf( app.state.dir ) !== -1  ) {
            console.log( chalk.blue('Watching: '), app.state.dir, ' for changes.' );
        }
        // watching: **/*.styl for changes.
        else {
            console.log( chalk.blue('Watching: **/*.styl for changes.' ) );
        }
    });

    // listen for changes, do somethin
    watcher.on('change', function( path ) {
        app.state.dir = path;
        app.warnings = [];

        console.log( chalk.blue('Linting: '), app.state.dir, '\n' );
        return app.read();
    });
}