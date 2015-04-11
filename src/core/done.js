'use strict';

/**
 * @description outputs our error messages when compvare (or a thumbs up if no errors)
 * @return void
 */
module.exports = function done( app, kill ) {
	var len = app.cache.warnings.length;
	var war = []; // for returning warnings after we wipe the 'real' ones

	app.msg = '\n' + app.emojiWarning() + len + ' Warnings';

	// if you set a max it displays a slightly more annoying message (that'll show em!)
	if ( kill === 'kill' ) {
		app.msg += '\nStylint: too many errors, exiting';
	}
	else if ( app.config.maxWarnings && ( len > app.config.maxWarnings ) ) {
		app.msg = app.emojiWarning() + 'Stylint: ' + len + ' warnings. Max is set to: ' + app.config.maxWarnings;
	}
	else if ( len === 0 ) {
		app.msg = app.emojiAllClear() + 'Stylint: You\'re all clear!';
		app.state.exitCode = 0;
	}

	// when testing we want to silence the console a bit, so we have the quiet option
	if ( !app.state.quiet ) {
		app.cache.warnings.forEach(function( val ) {
			console.log( 'Warning: ', val, '\n' );
			return war.push( val );
		});
		console.log( app.msg );
	}

	if ( !app.state.watching ) {
		process.exit( app.state.exitCode );
	}
	else {
		app.cache.warnings = [];
		return {
			exitCode: app.state.exitCode,
			msg: app.msg,
			warnings: war
		}
	}
};
