'use strict';

var
	alpha = /[A-Z]+/m,
	// we dont care about default css names, only look at vars, classes, ids, etc
	cssCheck = /^[$#.{:]+/m,
	// camelCase or CamelCase
	camel = /^[$#.{:]+([a-zA-Z]|[${}])+([a-z]|[${}])+(([.A-Z0-9])+[a-z ]+)+\b/m,
	// // lower-case-dashes-only
	// dash = /[a-z]+(-[.a-z]+)*\b/m,
	// // lower_case_underscores_only
	// score = /[a-z]+[_{}$.a-z]+\b/m,
	// BEM (http://bem.info/method/)
	bem = /^([$.#{:][${a-z]([-]?[${}a-z0-9]+)*(_{2}[${}a-z0-9]([-]?[${}a-z0-9]+)*)?((_[${}a-z0-9]([-]?[a-z0-9}]+)*){2})*)\b/m;


/**
 * check for names-like-this vs namesLikeThis or NamesLikeThis vs names_like_this or names-like__this-that
 * @param {string} [line] the line to be tested
 * @param {string} [convention] the naming convention to test againt. can be 'camelCase'|'underscore'|'dash'|'BEM'
 * @returns true, false, or undefined true if convention correct, false if not, undefined if line not testable
 */
module.exports = function checkNamingConvention( line, convention ) {
	if ( typeof line !== 'string' || typeof convention === 'undefined' ) { return; }

	// only run checks if on a class, id, or variable
	if ( cssCheck.test( line ) && line.indexOf('::') === -1 ) {
		if ( convention === 'camelCase' ) {
			if ( line.indexOf('-') === -1 &&
				line.indexOf('_') === -1 &&
				camel.test( line ) ) {
				return true;
			}
			else {
				return false;
			}
		}
		else if ( convention === 'lowercase_underscore' ) {
			if ( line.indexOf('-') === -1 &&
				line.indexOf('_') !== -1 &&
				!alpha.test( line ) ) {
				return true;
			}
			else {
				return false;
			}
		}
		else if ( convention === 'lowercase-dash' ) {
			if ( line.indexOf('-') !== -1 &&
				line.indexOf('_') === -1 &&
				!alpha.test( line ) ) {
				return true;
			}
			else {
				return false;
			}
		}
		else if ( convention === 'BEM' ) {
			if ( !alpha.test( line ) && bem.test( line ) ) {
				return true;
			}
			else {
				return false;
			}
		}
	}
}
