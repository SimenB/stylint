// called when --version or -v flags used, just displays version number
module.exports = function version() {
    'use strict';
    var app = this;

    app.fs.readFile('package.json', function( err, data ) {
        if ( err ) { throw err; }
        console.log( app.chalk.blue('\nStylint version: '), JSON.parse( data ).version, '\n' );
    });
}