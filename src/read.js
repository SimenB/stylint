const
    fs    = require('fs'),
    glob  = require('glob').Glob;   // oh my (file) glob


/**
 * @description determines what files to read, creates an array of them, and passes it to be parsed
 * @param  {[type]} lintMe [description]
 * @param  {[type]} config [description]
 * @returns function
 */
module.exports = function read() {
    'use strict';
    var app = this;

    // if nothing passed in, default to linting the curr dir
    if ( this.state.dir === process.cwd() ) {
        glob( app.state.dir + '/**/*.styl', {}, function( err, files ) {
            if ( err ) { throw err; }
            var len = files.length - 1;

            files.forEach(function( file, i ) {
                return app.parse( file, len, i );
            });
        });
    }

    /**
     * else we'll have either a filename or dir name to work with
     * if directory we use the glob logic to return an array of files to test
     */
    else {
        fs.stat(app.state.dir, function( err, stats ) {
            if ( err ) { throw err; }

            if ( stats.isFile() ) {
                return app.parse( app.state.dir, 1, 1 );
            }
            else if ( stats.isDirectory() ) {
                glob(app.state.dir + '**/*.styl', {}, function( err, files ) {
                    if ( err ) { throw err; }
                    var len = files.length - 1;

                    files.forEach(function( file, i ) {
                        return app.parse( file, len, i );
                    });
                });
            }
        });
    }
}