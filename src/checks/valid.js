'use strict';

// dont throw false positives on user created names or syntax
var attrRe = /^\[\S+\]/;
var elAttrRe = /(?=\S)+\[\S+\]/gm;
var ignoreRe = /[&$.#(=>]|({[\S]+})|(if)|(for)|(else)|(@block)/;
var numRe = /\d(?=[px]|%|[em]|[rem]|[vh]|[vw]|[vmin]|[vmax]|[ex]|[ch]|[mm]|[cm]|[in]|[pt]|[pc]|[mozmm])/;


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
	if ( !this.state.keyframes ) {
		if ( line.indexOf('from ') !== -1 || line.indexOf('to ') !== -1 ) {
			return;
		}
	}

	// if using an attribute selector ( div[madeUpAttribute] ), strip it out first ( div )
	if ( elAttrRe.test( arr[0] ) ) {
		arr[0] = arr[0].replace(elAttrRe, '');
	}

	this.valid.css.forEach(function(css) {
		// if property matches (border, margin)
		if ( arr[0] === css ) {
			isValid = true;
			return;
		}

		// if prefix + property matches (-webkit-border-radius)
		this.valid.prefixes.forEach(function(prefix) {
			if ( arr[0] === prefix + css ) {
				isValid = true;
				return;
			}
		}.bind(this));
	}.bind(this));

	// if the above didn't find a valid property
	// try the html array
	if ( !isValid ) {
		this.valid.html.forEach(function(html) {
			// if property matches (div, article)
			if ( arr[0] === html ) {
				isValid = true;
				return;
			}

			// if property + pseudo matches (a:hover, button:focus)
			this.valid.pseudo.forEach(function(pseudo) {
				if ( arr[0] === html + pseudo ) {
					isValid = true;
					return;
				}
			}.bind(this));
		}.bind(this));
	}

	if ( isValid === false ) {
		this.cache.warnings.push( 'property is not valid' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return isValid;
};
