const
    fs = require('fs'),
    chalk = require('chalk');

// called when --version or -v flags used, just displays version number
module.exports = function version() {
    'use strict';

    fs.readFile('package.json', function( err, data ) {
        if ( err ) { throw err; }
        var ver = JSON.parse( data ).version;
        console.log( chalk.blue('\nStylint version: '), ver, '\n' );
    });
}