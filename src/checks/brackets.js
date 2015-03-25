'use strict';

var
	openBracket = /\{$/,
	closeBracket = /\}$/,
	interpolation = /({\S)(\S)+[}]|([{]\S[}])/;

module.exports = function checkForBrackets( line, areWeInAHash ) {
	if ( typeof areWeInAHash === 'undefined' ||
		typeof line !== 'string' ) {
		return;
	}

	// console.log( areWeInAHash );

	// if interpolation we cool
	if ( interpolation.test(line) ) {
		return false;
	}
	// not interpolation, has a { or }
	else if ( openBracket.test(line) ||
		closeBracket.test(line) ) {
		// ex .someClass {
		if ( openBracket.test(line) && line.indexOf('=') === -1 ) {
			return true;
		}
		// ex } when not in a hash and not an interpolated variable
		else if ( closeBracket.test(line) && areWeInAHash ) {
			return false;
		}
		// ex } when not in a hash and not an interpolated variable
		else if ( closeBracket.test(line) && !areWeInAHash ) {
			return true;
		}
	}
	// else no brackets, return undefined
};
