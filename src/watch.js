const
    argv        = require('yargs').argv,
    init        = require('./init'),
    chalk       = require('chalk'),
    chokidar    = require('chokidar'); // better file watching than fs.watch


module.exports = function watch() {
    var watcher,
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
        ],
        currDir = false;

    /**
     * default to linting the current dir if nothing passed.
     */
    if ( flags.indexOf( process.argv[2] ) !== -1 ) {
        currDir = true;
        watcher = chokidar.watch('**/*.styl', {
            ignored: /[\/\\]\./,
            persistent: true
        });
    }
    // else just lint what was passed
    else {
        watcher = chokidar.watch(process.argv[2], {
            ignored: /[\/\\]\./,
            persistent: true
        });
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
    watcher.on('change', function(path) {
        warnings = [];

        console.log( chalk.blue('Linting: '), path, '\n' );
        // this is really just to give people time to read the watch msg
        setTimeout(function() {
            // kickoff linter, default to linting curr dir if no file or dir passed
            if ( !argv.v && !argv.h && !argv.version && !argv.help ) {
                if ( argv.c || argv.config ) {
                    if ( !process.argv[2] ) {
                        return init( 'nothing', argv.c ? argv.c : argv.config );
                    }
                    // else lint what was passed
                    else {
                        return init( process.argv[2], argv.c ? argv.c : argv.config );
                    }
                }
                else {
                    if ( !process.argv[2] ) {
                        return init( 'nothing' );
                    }
                    // else lint what was passed
                    else {
                        return init( process.argv[2] );
                    }
                }
            }
        }, 350);
    });
}