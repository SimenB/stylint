'use strict';

var chalk = require('chalk');

/**
 * @description outputs our error messages when compvare (or a thumbs up if no errors)
 * @return void
 */
module.exports = function done( app ) {
    var i = 0,
        len = app.warnings.length;

    // output error messages
    for ( i; i < len; i++ ) {
        console.log( chalk.yellow('Warning: '), app.warnings[i], '\n' );
    }

    // if you set a max it displays a slightly more annoying message (that'll show em!)
    if ( app.config.maxWarnings && len > app.config.maxWarnings ) {
        console.log( '\uD83D\uDCA9 ', chalk.underline.red( 'Stylint: ' + len + ' warnings. Max is set to: ' + app.config.maxWarnings ) );
    }
    else if ( len === 0 ) {
        console.log( '\uD83D\uDC4D ', chalk.blue( 'Stylint: You\'re all clear!' ) );
    }
    else {
        console.log( '\n\uD83D\uDCA9 ', chalk.yellow( len + ' Warnings' ) );
    }

    // reset in case of watch
    app.warnings = [];
}