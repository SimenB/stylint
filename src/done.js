const chalk = require('chalk');

/**
 * @description outputs our error messages when complete (or a thumbs up if no errors)
 * @param  {Array<string>} warnings [all errors messages]
 * @return void
 */
module.exports = function done() {
    'use strict';
    var len = this.warnings.length;

    this.warnings.forEach(function( warning ) {
        console.log( chalk.yellow('Warning: '), warning, '\n' );
    });

    // if you set a max it displays a slightly more annoying message (that'll show em!)
    if ( this.config.maxWarnings && len > this.config.maxWarnings ) {
        console.log( '\uD83D\uDCA9 ', chalk.underline.red( 'Stylint: ' + len + ' warnings. Max is set to: ' + this.config.maxWarnings + '\n' ) );
    }
    else if ( len === 0 ) {
        console.log( '\n \uD83D\uDC4D ', chalk.blue( 'Stylint: You\'re all clear!\n' ) );
    }
    else {
        console.log( '\uD83D\uDCA9 ', chalk.yellow( len + ' Warnings\n' ) );
    }
}