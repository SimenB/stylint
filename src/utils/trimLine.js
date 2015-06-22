'use strict';

/**
 * @description separate out line comments and remove interpolation
 * @param {string} [line] curr line being linted
 * @returns {string} the line, but minus all the annoying stuff
*/
var trimLine = function( line ) {
	var startsWithCommentRe = /(^\/\/)/;
	this.state.hasComment = false;

	// strip line comments
	if ( line.indexOf( '//' ) !== -1 &&
		!startsWithCommentRe.test( line.trim() ) ) {

		this.cache.comment = line.slice( line.indexOf( '//' ), line.length );
		line = line.slice( 0, line.indexOf( '//' ) - 1 );
		this.state.hasComment = true;
	}

	// strip interpolated variables
	return line.replace( /{\S+}/, '' );
};

module.exports = trimLine;
