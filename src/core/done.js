'use strict';

/**
 * @description outputs our error messages (or a thumbs up if no errors)
 */
module.exports = function done(kill) {
	// for returning warnings after we wipe the 'real' ones
	// var war = [];

	// total errors
	this.cache.msg = '\nStylint: ' + this.emojiWarning() + this.cache.errs.length + ' Errors.';
	this.cache.msg += this.config.maxErrors ? ' (Max Errors: ' + this.config.maxErrors + ')' : '';
	// total warnings
	this.cache.msg += '\nStylint: ' + this.emojiWarning() + this.cache.warnings.length + ' Warnings.';
	this.cache.msg += this.config.maxWarnings ? ' (Max Warnings: ' + this.config.maxWarnings + ')' : '';

	// if you set a max it displays a slightly more annoying message (that'll show em!)
	if ( kill === 'kill' ) {
		this.cache.msg += '\nStylint: Over Error or Warning Limit.';
	}
	else if ( this.cache.warnings.length === 0 && this.cache.errs.length === 0 ) {
		this.cache.msg = this.emojiAllClear() + 'Stylint: You\'re all clear!';
		this.state.exitCode = 0;
	}

	// when testing we want to silence the console a bit, so we have the quiet option
	if ( !this.state.quiet ) {
		this.cache.errs.forEach(function(err) {
			return console.log( err, '\n' );
		});

		this.cache.warnings.forEach(function(war) {
			return console.log( war, '\n' );
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
		msg: this.cache.msg
	}
};
