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
module.exports = function parse( app, file, len, fileNum ) {
	return fs.readFile(file, { encoding: 'utf8' }, function( err, data ) {
		if ( err ) { throw err; }
		var lines = data.replace(stripCommentsRe, function( match ) {
			var lines = match.split(/\r\n|\r|\n/);
			var lineLen = lines.length - 1;
			var output = ' ';

			if ( lineLen > 0 ) {
				while ( lineLen-- ) {
					output += '\n';
				}
			}

			// output.split('\n');
			// console.dir( output );
			return output;
		}).split('\n');

		// console.log( lines );

		/**
		 * so, this function trims each line and then tests it
		 * @param  {string} [line] the line of stylus to test
		 * @return {function} run test
		 */
		return lines.forEach(function( line, i ) {
			i++; // line nos don't start at 0
			// console.log( line );
			app.line = line;
			app.lineNo = i;
			app.file = file;

			// app, line, num, output, file
			return app.test( app );
		});

		// if at the last file, call the done function to output results
		if ( fileNum === len ) {
			return app.done( app );
		}
	});
};
