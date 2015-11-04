'use strict'

// 1 grab attribute selectors OR mixins that are by themselves
// 2 strip attr selectors or classes/ids from elements
// 3 ignore syntax
// 4 ignore numbers
// 5 ( from || to ) are only valid inside @keyframe
// 6 the actual JSON property whitelist we will test against
var attrOrMixinRe = /^\[\S+\]|({[\S]+})|(\([\S ]+\))|(\(\))/ // 1
var stripRe = /(?=\S)\[\S+\]|(\.|#)(\w|-)+/ // /(?=\S)\[\S+\]/ // 2
var ignoreRe = /^[$.#]|[&=>+~]|if|for|else|return|@block|calc|@extend|@media/ // 3
var numRe = /\d+?(?=px|%|em|rem|v(h|w)|v(min|max)|ex|ch|mm|cm|in|pt|pc|mozmm)/ // 4
var keyRe = /((from)|(to))+(?= $| {| \d|\n|{)/ // 5
var validJSON = require( '../data/valid.json' ) // 6


/**
* @description check against a JSON of all valid css properties and values
* @param {string} [line] current line being linted
* @returns {boolean | undefined} true if problem, false if no prob, undefined if we skipped
*/
module.exports = function valid( line ) {
	// from and to are valid keyframes properties, but not outside that context
	if ( !this.state.keyframes && line.match( keyRe ) ) { return }

	// 1 split by tabs and spaces, tabs mess with pattern matching
	var isValid = false
	var arr = this.splitAndStrip( new RegExp( /[\s\t,:]/ ), line ) // 1

	// if not splittable for some reason
	if ( typeof arr[0] === 'undefined' ) { return }

	// in order, let line be considered valid if:
	// 1 we are in a hash or css block
	// 2 classname, varname, id, or syntax.
	// 3 if the selector only consists of an attr or mixin (which can be custom)
	// 4 if it's a number
	if ( this.state.hashOrCSS || // 1
		ignoreRe.test( line.trim() ) || // 2
		attrOrMixinRe.test( line ) || // 3
		numRe.test( arr[0] ) ) { // 3
		isValid = true
	}

	// if using an attr selector ( div[madeUpAttribute] ), strip it out ( div )
	if ( !isValid ) {
		arr[0] = arr[0].replace( stripRe, '' ).trim()
	}

	// if no match yet, check for css && prefix + css, will return true at first match
	if ( !isValid ) {
		isValid = validJSON.css.some( function( css ) {
			return arr[0] === css || this.checkPrefix( arr[0], css, validJSON )
		}.bind( this ) )
	}

	// if no match yet, try html && html + pseudo
	if ( !isValid ) {
		isValid = validJSON.html.some( function( html ) {
			return arr[0] === html || this.checkPseudo( arr[0], html, validJSON )
		}.bind( this ) )
	}

	// if no match yet, try declared mixins
	if ( !isValid ) {
		isValid = this.cache.mixins.some( function( mixin ) {
			return arr[0] === mixin
		} )
	}

	if ( isValid === false ) {
		this.msg( 'property is not valid' )
	}

	return isValid
}
