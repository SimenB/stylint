'use strict';

var fs = require('fs');
var stripCommentsRe = /(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)/gm;


/**
 * @description parses file for testing by removing extra new lines and block comments
 * @param  {string} file        [the current file being parsed]
 * @param  {number} len         [total number of files to parse]
 * @param  {number} fileNum     [the current file being parsed (# of len) ]
 * @returns test function
 */
module.exports = function parse() {
	return fs.readFile(this.cache.file, { encoding: 'utf8' }, function( err, data ) {
		if ( err ) { throw new Error('readFile err. Did you pass in a correct filename?'); }

		var lines = data.replace(stripCommentsRe, function( match ) {
			var linesNum = match.split(/\r\n|\r|\n/).length - 1;
			var output = '';

			while ( linesNum-- ) {
				output += '\n';
			}

			return output;
		});

		lines = lines.split('\n');


		/**
		 * so, this function trims each line and then tests it
		 * @param  {string} [line] the line of stylus to test
		 * @return {function} run test
		 */
		lines.forEach(function( line, i ) {
			i++; // line nos don't start at 0
			this.cache.line = line;
			this.cache.lineNo = i;
			return this.setState();
		}.bind(this));

		// if at the last file, call the done function to output results
		if ( this.cache.fileNo === this.cache.filesLen ) {
			return this.done();
		}
	}.bind(this));
};
