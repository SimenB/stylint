'use strict';

/**
 * @description outputs our error messages (or a thumbs up if no errors)
 */
module.exports = function done( kill ) {
	var len = this.cache.warnings.length;
	var war = []; // for returning warnings after we wipe the 'real' ones

	this.cache.msg = '\n' + this.emojiWarning() + len + ' Warnings';

	// if you set a max it displays a slightly more annoying message (that'll show em!)
	if ( kill === 'kill' ) {
		this.cache.msg += '\nStylint: too many errors, exiting';
	}
	else if ( this.config.maxWarnings && ( len > this.config.maxWarnings ) ) {
		this.cache.msg = this.emojiWarning() + 'Stylint: ' + len + ' warnings. Max is set to: ' + this.config.maxWarnings;
	}
	else if ( len === 0 ) {
		this.cache.msg = this.emojiAllClear() + 'Stylint: You\'re all clear!';
		this.state.exitCode = 0;
	}

	// when testing we want to silence the console a bit, so we have the quiet option
	if ( !this.state.quiet ) {
		this.cache.warnings.forEach(function( val ) {
			console.log( 'Warning: ', val, '\n' );
			return war.push( val );
		});

		console.log( this.cache.msg );
	}

	// dont kill the linter if watch is watchin
	if ( !this.state.watching ) {
		return process.exit( this.state.exitCode );
	}

	this.cache.warnings = [];
	return {
		exitCode: this.state.exitCode,
		msg: this.cache.msg,
		warnings: war
	}
};
