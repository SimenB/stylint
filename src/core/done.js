'use strict';

/**
 * @description outputs our error messages (or a thumbs up if no errors)
 */
module.exports = function done(kill) {
	var warningsOrErrors = [];
	var msg = '';

	// total errors
	this.cache.msg = '\nStylint: ' + this.cache.errs.length + ' Errors.';
	this.cache.msg += this.config.maxErrors ? ' (Max Errors: ' + this.config.maxErrors + ')' : '';
	// total warnings
	this.cache.msg += '\nStylint: ' + this.cache.warnings.length + ' Warnings.';
	this.cache.msg += this.config.maxWarnings ? ' (Max Warnings: ' + this.config.maxWarnings + ')' : '';

	// if you set a max it displays a slightly more annoying message (that'll show em!)
	if ( kill === 'kill' ) {
		this.cache.msg += '\nStylint: Over Error or Warning Limit.';
	}
	else if ( this.cache.warnings.length === 0 && this.cache.errs.length === 0 ) {
		this.cache.msg = 'Stylint: You\'re all clear!';
		this.state.exitCode = 0;
	}

	// when testing we want to silence the console a bit, so we have the quiet option
	if ( !this.state.quiet ) {
		this.cache.errs.forEach(function(err) {
			return warningsOrErrors.push(err);
		});

		this.cache.warnings.forEach(function(war) {
			return warningsOrErrors.push(war);
		});

		msg = warningsOrErrors.join('\n\n');
		msg += '\n' + this.cache.msg;
		console.log( msg );
	}

	// dont kill the linter if watch is watchin
	if ( !this.state.watching ) {
		return process.exit( this.state.exitCode );
	}

	// if watching we reset the errors/warnings arrays
	this.cache.errs = [];
	this.cache.warnings = [];
	return {
		exitCode: this.state.exitCode,
		msg: this.cache.msg
	}
};
