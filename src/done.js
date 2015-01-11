const chalk = require('chalk');

/**
 * @description outputs our error messages when complete (or a thumbs up if no errors)
 * @return void
 */
module.exports = function done( app ) {
    'use strict';
    var i = 0,
        len = app.warnings.length;

    if ( !app.state.testENV ) {
        // output error messages
        for ( i; i < len; i++ ) {
            console.log( chalk.yellow('Warning: '), app.warnings[i], '\n' );
        }

        // if you set a max it displays a slightly more annoying message (that'll show em!)
        if ( app.config.maxWarnings && len > app.config.maxWarnings ) {
            console.log( '\uD83D\uDCA9 ', chalk.underline.red( 'Stylint: ' + len + ' warnings. Max is set to: ' + app.config.maxWarnings + '\n' ) );
        }
        else if ( len === 0 ) {
            console.log( '\n \uD83D\uDC4D ', chalk.blue( 'Stylint: You\'re all clear!\n' ) );
        }
        else {
            console.log( '\uD83D\uDCA9 ', chalk.yellow( len + ' Warnings\n' ) );
        }
    }

    // reset in case of watch
    app.warnings = [];
}