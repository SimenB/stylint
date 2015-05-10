'use strict';

// 1 grab attribute selectors that are by themselves
// 2 grab attribute selectors paired with an element
// 3 ignore syntax
// 4 ignore numbers
// 5 from / to are only valid inside @keyframe
// 6 the actual JSON we will use to determine validity
var attrRe = /^\[\S+\]/; // 1
var elAttrRe = /(?=\S)+\[\S+\]/gm; // 2
var ignoreRe = /[&$.#(=>]|({[\S]+})|(if)|(for)|(else)|(@block)/; // 3
var numRe = /\d(?=[px]|%|[em]|[rem]|[vh]|[vw]|[vmin]|[vmax]|[ex]|[ch]|[mm]|[cm]|[in]|[pt]|[pc]|[mozmm])/; // 4
var keyRe = /((from)|(to))(?= |\n|{)+/; // 5
var validJSON = require('../data/json/valid.json'); // 6

/**
* check against a JSON of all valid css properties and values
* @returns false if property or value not considered valid
* @returns true if valid
* @returns undefined if not testable (hmmm)
*/
module.exports = function valid(line) {
	// split by tabs and spaces, tabs mess with pattern matching
	var isValid = false;
	var arr = this.stripWhiteSpace(new RegExp(/[\s\t,]/), line);

	// in order, ignore line if:
	// 1 we are in a hash
	// 2 classname, varname, id, or syntax. basically, ignore if custom
	// 3 if the selector only consists of an attr (which can be custom)
	// 4 if it's a number
	if ( this.state.hash || // 1
		ignoreRe.test(line) || // 2
		attrRe.test(arr[0]) || // 3
		numRe.test(arr[0]) ) { // 4
		return;
	}

	// from and to are keyframes specific properties, but arent valid outside that context
	if ( !this.state.keyframes && line.match(keyRe) ) {
		return;
	}

	// if using an attribute selector ( div[madeUpAttribute] ), strip it out first ( div )
	if ( elAttrRe.test( arr[0] ) ) {
		arr[0] = arr[0].replace(elAttrRe, '');
	}

	// initial check for basic css, will return true at first match
	isValid = validJSON.css.some(function(css) {
		return ( arr[0] === css ) || this.checkPrefix( arr[0], css, validJSON );
	}.bind(this));

	// if no match yet, try html
	if ( !isValid ) {
		isValid = validJSON.html.some(function(html) {
			return ( arr[0] === html ) || this.checkPseudo( arr[0], html, validJSON );
		}.bind(this));
	}

	if ( isValid === false ) {
		this.cache.warnings.push( 'property is not valid' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return isValid;
};
