const
    init        = require('./init'),
    chalk       = require('chalk'),
    chokidar    = require('chokidar'); // better file watching than fs.watch


/**
 * kicks off the app. sets up config and kicks off reading the files
 * @param  {string} dir          [dir | filename | 'nothing']
 * @param  {string} customConfig [path to config object]
 * @return {function}            [kick off linter on each change]
 */
module.exports = function watch( dir, customConfig ) {
    if ( typeof dir === 'undefined' ) { return; }

    var watcher,
        currDir = false,
        flags = [
            '-c',
            '-w',
            '-s',
            '-v',
            '-h',
            '--config',
            '--watch',
            '--strict',
            '--version',
            '--help'
        ];

    // default to linting the current dir if nothing passed.
    if ( flags.indexOf( dir ) !== -1 ) {
        currDir = true;
        watcher = chokidar.watch('.');
    }
    // else just lint what was passed
    else {
        watcher = chokidar.watch( dir );
    }

    // initial watch msg
    watcher.on('ready', function() {
        // watching: dir or file for changes
        if ( !currDir ) {
            console.log( chalk.blue('Watching: '), process.argv[2], ' for changes.' );
        }
        // watching: **/*.styl for changes.
        else {
            console.log( chalk.blue('Watching: **/*.styl for changes.' ) );
        }
    });

    // listen for changes, do somethin
    watcher.on('change', function( path ) {
        console.log( chalk.blue('Linting: '), path, '\n' );
        // this is really just to give people time to read the watch msg
        setTimeout(function() {
            // kickoff linter, default to linting curr dir if no file or dir passed
            return init( path, customConfig );
        }, 350);
    });
}