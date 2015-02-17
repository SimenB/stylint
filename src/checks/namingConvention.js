'use strict';

var
	 // we dont care about default css names, only look at vars, classes, ids, etc
	cssCheck = /^[$#.]+/,
	 // camelCase or CamelCase
	camel = /^[$.#]+[a-zA-Z][a-z]+(?!_?!-)([.A-Z0-9]+[a-z =]+)+\b/,
	// lower-case-dashes-only
	dash = /^[$.#]+[a-z]+(?!_)(-[.a-z]+)*\b/,
	 // lower_case_underscores_only
	score = /^[$.#]+[a-z]+(?!-)(_[.a-z]+)*\b/,
	// BEM (http://bem.info/method/)
	bem = /^[$.#]+[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?((_[a-z0-9]([-]?[a-z0-9]+)*){2})*\b/;


/**
 * check for names-like-this vs namesLikeThis or NamesLikeThis vs names_like_this or names-like__this-that
 * @param {string} [line] the line to be tested
 * @param {string} [convention] the naming convention to test againt. can be 'camelCase'|'underscore'|'dash'|'BEM'
 * @returns true, false, or undefined true if convention correct, false if not, undefined if line not testable
 */
module.exports = function checkNamingConvention( line, convention ) {
	if ( typeof line !== 'string' || typeof convention === 'undefined' ) { return; }

	// only run checks if on a class, id, or variable
	if ( cssCheck.test( line ) ) {
		if ( convention === 'camelCase' ) {
			if ( camel.test( line ) && !dash.test( line ) && !score.test( line ) ) {
				return true;
			}
			else {
				return false;
			}
		}
		else if ( convention === 'lowercase_underscore' ) {
			if ( score.test( line ) ) {
				return true;
			}
			else {
				return false;
			}
		}
		else if ( convention === 'lowercase-dash' ) {
			if ( dash.test( line ) ) {
				return true;
			}
			else {
				return false;
			}
		}
		else if ( convention === 'BEM' ) {
			if ( bem.test( line ) ) {
				return true;
			}
			else {
				return false;
			}
		}
	}
}
