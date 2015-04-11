'use strict';

var alphaRe = /[A-Z]+/m;
// camelCase or CamelCase
var camelRe = /^[$#.{:]+([a-zA-Z]|[${}])+([a-z]|[${}])+(([.A-Z0-9])+[a-z ]+)+\b/m;
// BEM (http://bem.info/method/)
var bemRe = /^([$.#{:][${a-z]([-]?[${}a-z0-9]+)*(_{2}[${}a-z0-9]([-]?[${}a-z0-9]+)*)?((_[${}a-z0-9]([-]?[a-z0-9}]+)*){2})*)\b/m;


/**
 * check for names-like-this vs namesLikeThis or NamesLikeThis vs names_like_this or names-like__this-that
 * @param {string} [line] the line to be tested
 * @param {string} [convention] the naming convention to test againt. can be 'camelCase'|'underscore'|'dash'|'BEM'
 * @returns true, false, or undefined true if convention correct, false if not, undefined if line not testable
 */
module.exports = function checkNamingConvention( app ) {
	var firstCheckRe = /^[${:]+/m;
	var arr = app.cache.lineArr; // convenience
	var badConvention = false;

	if ( app.config.namingConventionStrict === true ) {
		firstCheckRe = /^[$#.{:]+/m; // more stricter regex
	}

	// only run checks if on a class, id, or variable
	if ( firstCheckRe.test( arr[0] ) && arr[0].indexOf('::') === -1 ) {
		// matches just lowercase first
		if ( !alphaRe.test( arr[0] ) &&
			arr[0].indexOf('-') === -1 &&
			arr[0].indexOf('_') === -1 ) {
			badConvention = true;
			// return true;
		}
		// then check conventions
		else if ( app.config.namingConvention === 'camelCase' ) {
			if ( arr[0].indexOf('-') === -1 &&
				arr[0].indexOf('_') === -1 &&
				camelRe.test( arr[0] ) ) {
				badConvention = true;
				// return true;
			}
		}
		else if ( app.config.namingConvention === 'lowercase_underscore' ) {
			if ( arr[0].indexOf('-') === -1 &&
				arr[0].indexOf('_') !== -1 &&
				!alphaRe.test( arr[0] ) ) {
				badConvention = true;
				// return true;
			}
		}
		else if ( app.config.namingConvention === 'lowercase-dash' ) {
			if ( arr[0].indexOf('-') !== -1 &&
				arr[0].indexOf('_') === -1 &&
				!alphaRe.test( arr[0] ) ) {
				badConvention = true;
				// return true;
			}
		}
		else if ( app.config.namingConvention === 'BEM' ) {
			if ( !alphaRe.test( arr[0] ) && bemRe.test( arr[0] ) ) {
				badConvention = true;
				// return true;
			}
		}
	}

	return badConvention;
};
