'use strict'

/**
 * format output message for console
 * @param  {string}   msg  error msg from one of the checks
 * @param  {string}   done whether or not this is the last message to output
 * @param  {string}   kill whether or not we're over one of our limits
 * @return {string | Function} either the formatted msg or done()
 */
var reporter = function( msg, done, kill ) {
	if ( done === 'done' ) {
		// total errors
		this.cache.msg = '\nStylint: ' + this.cache.errs.length + ' Errors.'
		this.cache.msg += this.config.maxErrors ? ' (Max Errors: ' + this.config.maxErrors + ')' : ''
		// total warnings
		this.cache.msg += '\nStylint: ' + this.cache.warnings.length + ' Warnings.'
		this.cache.msg += this.config.maxWarnings ? ' (Max Warnings: ' + this.config.maxWarnings + ')' : ''

		// if you set a max it kills the linter
		if ( kill === 'kill' ) {
			this.cache.msg += '\nStylint: Over Error or Warning Limit.'
		}
		else if ( this.cache.errs.length === 0 &&
			this.cache.warnings.length === 0 ) {
			this.cache.msg = ''
		}

		return this.done()
	}

	return this.state.severity + ': ' + msg + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.origLine.trim()
}

module.exports = reporter
