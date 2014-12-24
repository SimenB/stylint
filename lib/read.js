var fs          = require('fs'),                // base node file system module
    glob        = require('glob').Glob;         // oh my (file) glob

module.exports = function read( lintMe ) {
    // if nothing passed in, default to linting the curr dir. or if -all flag is passed, lint everything
    if ( flags.indexOf( lintMe ) !== -1 || lintMe === 'nothing' ) {
        glob('**/*.styl', {}, function(err, files) {
            if (err) { throw err; }
            var len = files.length - 1;

            files.forEach(function( file, i ) {
                return Lint.parse( file, len, i );
            });
        });
    }

    /**
     * else we'll have either a filename or dir name to work with
     * if directory we use the glob logic to return an array of files to test
     */
    else {
        fs.stat(lintMe, function( err, stats ) {
            if (err) { throw err; }

            if ( stats.isFile() ) {
                return Lint.parse( lintMe, 1, 1 );
            }
            else if ( stats.isDirectory() ) {
                glob(lintMe + '**/*.styl', {}, function( err, files ) {
                    if (err) { throw err; }
                    var len = files.length - 1;

                    files.forEach(function(file, i) {
                        return Lint.parse( file, len, i );
                    });
                });
            }
        });
    }
}