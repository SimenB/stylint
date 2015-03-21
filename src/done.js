'use strict';

var osType = require('os').type().toLowerCase();

/**
 * @description outputs our error messages when compvare (or a thumbs up if no errors)
 * @return void
 */
module.exports = function done( app, kill ) {
	var i = 0,
		exitCode = 0,
		len = app.warnings.length,
		emojiAllClear = '',
		emojiWarning = '';

	// output smiley or sad face, or emoji, depending on system
	if ( app.config.emoji ) {
		if ( osType.indexOf('windows') >= 0 ) {
			emojiAllClear = ':) ';
			emojiWarning = ':( ';
		}
		else {
			emojiAllClear = '\uD83D\uDC4D  ',
			emojiWarning = '\uD83D\uDCA9  ';
		}
	}

	// output error messages
	for ( i; i < len; i++ ) {
		console.log( 'Warning: ', app.warnings[i], '\n' );
	}

	// if you set a max it displays a slightly more annoying message (that'll show em!)
	if ( app.config.maxWarnings && len > app.config.maxWarnings ) {
		console.log( emojiWarning + 'Stylint: ' + len + ' warnings. Max is set to: ' + app.config.maxWarnings );
		exitCode = 1;
	}
	else if ( len === 0 ) {
		console.log( emojiAllClear + 'Stylint: You\'re all clear!' );
	}
	else {
		console.log( '\n' + emojiWarning + len + ' Warnings' );
		exitCode = 1;
	}

	// if we got here via an error
	if ( kill ) {
		console.log('Stylint: too many errors, exiting');
		exitCode = 2;

		if ( !app.state.watching ) {
			process.exit(2);
		}
		else {
			app.warnings = [];
			return;
		}
	}

	if ( !app.state.watching ) {
		process.exit( exitCode );
	}
}
