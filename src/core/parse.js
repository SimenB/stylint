'use strict';

var stripCommentsRe = /(^(\/\*)|^([ \t](\/\*)))(?!\/)(.|[\r\n]|\n)+?\*\/\n?\n?/gm;


/**
 * @description parses file for testing by removing extra new lines and block comments
 * @param  {string} file        [the current file being parsed]
 * @param  {number} len         [total number of files to parse]
 * @param  {number} fileNum     [the current file being parsed (# of len) ]
 * @returns test function
 */
module.exports = function parse( err, res ) {
	return res.forEach(function(file, i) {
		this.cache.file = this.cache.files[i];
		this.cache.fileNo = i;

		// strip out block comments, but dont destroy line history
		// to do these we replace block comments with new lines
		var lines = file.toString().replace( stripCommentsRe, function( str ) {
			return ( new Array( str.split(/\r\n|\r|\n/).length ) ).join('\n');
		}).split('\n');

		// now that we have a clean file, iterate over it
		// updating cache as we go, and passing to the next step
		lines.forEach(function( line, i ) {
			i++; // line nos don't start at 0
			this.cache.line = this.trimLine(line);
			this.cache.lineNo = i;
			return this.setState();
		}.bind(this) );

		// if on the last file, call the done function to output success or error msg
		if ( this.cache.fileNo === res.length - 1 ) {
			return this.done();
		}
	}.bind(this) );
};
