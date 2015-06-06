module.exports = function reporter( msg, done, kill ) {
	if ( done === 'done' ) {
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

		return this.done();
	}

	return this.state.severity + ': ' + msg + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim();
}
