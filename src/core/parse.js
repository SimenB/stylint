'use strict';

// strips out block comments and urls
var cleanFileRe = /(\r\n|\n|\r)|(^(\/\*)|([\s'"](\/\*)))(?!\/)(.|[\r\n]|\n)+?\*\/\n?/gm;
var lineEndingsRe = /\r\n|\n|\r/gm;


/**
 * @description parses file for testing by removing extra new lines and block comments
 * @param {Object} [err] error obj from async if it exists
 * @param {Array} [res] array of files to parse
 * @param {boolean} [skipDone] if true, don't call done
 * @returns {Object} the result object from the run
 */
var parse = function( err, res, skipDone ) {
	if ( err ) { throw new Error( err ); }

	res.forEach( function( file, i ) {
		var lines;
		this.cache.file = this.cache.files[i];
		this.cache.fileNo = i;

		// strip out block comments, but dont destroy line history
		// to do these we replace block comments with new lines
		lines = file.toString().replace( cleanFileRe, function( str ) {
			// WHERE IS YOUR GOD NOW
			return ( new Array( str.split( lineEndingsRe ).length ) ).join( '\n' );
		} ).split( '\n' );

		// updating cache as we go, and passing to the next step
		lines.forEach( function( line, lineNo ) {
			this.cache.source = line;
			this.cache.line = this.trimLine( line );
			this.cache.lineNo = lineNo + 1; // line nos don't start at 0
			this.cache.rule = '';
			this.cache.col = null;
			return this.setState( line );
		}.bind( this ) );

		// save previous file
		this.cache.prevFile = this.cache.file;
	}.bind( this ) );

	this.transformMessages( skipDone );

	return this.cache.report;
};

module.exports = parse;
