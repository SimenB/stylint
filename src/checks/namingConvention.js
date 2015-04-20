'use strict';

// the alphabet, uppers
var alphaRe = /[A-Z]+/m;
// BEM (http://bem.info/method/)
var bemRe = /^([$.#{:][${a-z]([-]?[${}a-z0-9]+)*(_{2}[${}a-z0-9]([-]?[${}a-z0-9]+)*)?((_[${}a-z0-9]([-]?[a-z0-9}]+)*){2})*)\b/m;
// camelCase or CamelCase
var camelRe = /^[$#.{:]+([a-zA-Z]|[${}])+([a-z]|[${}])+(([.A-Z0-9])+[a-z ]+)+\b/m;
// initial check to determine if line should be tested
var doWeTestRe = /^[${:]+/m;

/**
 * check for names-like-this vs namesLikeThis or NamesLikeThis vs names_like_this or names-like__this-that
 * @param {string} [line] the line to be tested
 * @param {string} [convention] the naming convention to test againt. can be 'camelCase'|'underscore'|'dash'|'BEM'
 * @returns true, false, or undefined true if convention correct, false if not, undefined if line not testable
 */
module.exports = function namingConvention(line) {
	var arr = this.cache.lineArr; // convenience
	var badConvention = false;

	if ( this.config.namingConventionStrict === true ) {
		doWeTestRe = /^[$#.{:]+/m; // test a wider range
	}

	// only run checks if on a class, id, or variable
	if ( doWeTestRe.test( arr[0] ) && arr[0].indexOf('::') === -1 ) {
		// matches just lowercase first
		if ( !alphaRe.test( arr[0] ) &&
			arr[0].indexOf('-') === -1 &&
			arr[0].indexOf('_') === -1 ) {
			badConvention = false;
		}
		// then check conventions
		else if ( this.config.namingConvention === 'camelCase' ) {
			if ( arr[0].indexOf('-') === -1 &&
				arr[0].indexOf('_') === -1 &&
				camelRe.test( arr[0] ) ) {
				badConvention = true;
			}
		}
		else if ( this.config.namingConvention === 'lowercase_underscore' ) {
			if ( arr[0].indexOf('-') === -1 &&
				arr[0].indexOf('_') !== -1 &&
				!alphaRe.test( arr[0] ) ) {
				badConvention = true;
			}
		}
		else if ( this.config.namingConvention === 'lowercase-dash' ) {
			if ( arr[0].indexOf('-') !== -1 &&
				arr[0].indexOf('_') === -1 &&
				!alphaRe.test( arr[0] ) ) {
				badConvention = true;
			}
		}
		else if ( this.config.namingConvention === 'BEM' ) {
			if ( !alphaRe.test( arr[0] ) && bemRe.test( arr[0] ) ) {
				badConvention = true;
			}
		}
	}

	if ( badConvention === true ) {
		this.cache.warnings.push( 'preferred naming convention is ' + this.config.namingConvention + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return badConvention;
};
