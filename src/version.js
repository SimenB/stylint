const
    fs = require('fs'),
    chalk = require('chalk');

// called when --version or -v flags used, just displays version number
module.exports = function version( app ) {
    'use strict';

    return fs.readFile('package.json',
        function( err, data ) {
            if ( err ) { throw err; }
            if ( app.state.testENV ) { return; }
            return console.log( chalk.blue('\nStylint version: '), JSON.parse( data ).version, '\n' );
        }
    );
}