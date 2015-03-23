'use strict';

/**
 * @description outputs our error messages when compvare (or a thumbs up if no errors)
 * @return void
 */
module.exports = function done( app, kill ) {
	var len = app.cache.warnings.length;

	app.cache.warnings.forEach(function( val ) {
		console.log( 'Warning: ', val, '\n' );
	});

	// if you set a max it displays a slightly more annoying message (that'll show em!)
	if ( app.config.maxWarnings && ( len > app.config.maxWarnings ) ) {
		console.log( app.emojiWarning() + 'Stylint: ' + len + ' warnings. Max is set to: ' + app.config.maxWarnings );
		app.state.exitCode = 1;
	}
	else if ( len === 0 ) {
		console.log( app.emojiAllClear() + 'Stylint: You\'re all clear!' );
	}
	else {
		console.log( '\n' + app.emojiWarning() + len + ' Warnings' );
		app.state.exitCode = 1;
	}

	// if we got here via an error
	if ( kill === 'kill' ) {
		console.log('Stylint: too many errors, exiting');
		app.state.exitCode = 2;

		if ( !app.state.watching ) {
			process.exit(2);
		}
		else {
			app.cache.warnings = [];
			return;
		}
	}

	if ( !app.state.watching ) {
		process.exit( app.state.exitCode );
	}
}
