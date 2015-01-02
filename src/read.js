const
    fs    = require('fs'),
    glob  = require('glob').Glob,   // oh my (file) glob
    parse = require('./parse');      // parse the files


/**
 * @description determines what files to read, creates an array of them, and passes it to be parsed
 * @param  {[type]} lintMe [description]
 * @param  {[type]} config [description]
 * @returns function
 */
module.exports = function read( lintMe, config ) {
    'use strict';

    var flags = [
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

    // if nothing passed in, default to linting the curr dir
    if ( flags.indexOf( lintMe ) !== -1 || lintMe === 'nothing' ) {
        glob('**/*.styl', {}, function(err, files) {
            if ( err ) { throw err; }
            var len = files.length - 1;

            files.forEach(function( file, i ) {
                return parse( file, len, i, config );
            });
        });
    }

    /**
     * else we'll have either a filename or dir name to work with
     * if directory we use the glob logic to return an array of files to test
     */
    else {
        fs.stat(lintMe, function( err, stats ) {
            if ( err ) { throw err; }

            if ( stats.isFile() ) {
                return parse( lintMe, 1, 1, config );
            }
            else if ( stats.isDirectory() ) {
                glob(lintMe + '**/*.styl', {}, function( err, files ) {
                    if ( err ) { throw err; }
                    var len = files.length - 1;

                    files.forEach(function(file, i) {
                        return parse( file, len, i, config );
                    });
                });
            }
        });
    }
}