var stampit = require('stampit');

/**
 * configuration related properties
 * this is what the linter will run when no config file is passed
 */
module.exports = stampit().state({
	config: {
		blockStyle: false, // check for @block when defining blocks
		brackets: true, // check for { or }, unless used in a hash
		colons: false, // check for unecessary colons
		colors: false, // check for hex colors used without variables
		commaSpace: true, // check for spaces after commas (0, 0, 0, .18)
		commentSpace: false, // check for space after line comment
		cssLiteral: false, // if true disallow css literals
		depthLimit: false, // set a maximum selector depth (dont nest more than 4 deep)
		duplicates: true, // check if properties or selectors are duplicate
		efficient: true, // check for margin 0 0 0 0 and recommend margin 0
		emoji: false, // toggle emoji on or off
		extendPref: false, // prefer a specific syntax when using @extends (or @extend)
		globalDupe: false, // throw duplicate selector warning across all files instead of curr file
		indentSpaces: 4, // how many spaces should we prefer when indenting, pass in false if hard tabs
		leadingZero: true, // find cases where 0.# is used, prefer .#
		maxWarnings: 10, // should we have a max amount of warnings, and error out if we go over
		maxWarningsKill: false, // if over maxWarning count, kill process
		mixed: false, // check for mixed spaces and tabs
		namingConvention: false, // lowercase-dash, camelCase, lowercase_underscore, BEM or false (dont check)
		namingConventionStrict: false, // if true, then check classes and ids, if false just check variables
		noNone: true, // check for use of border none or outline none, prefer 0
		parenSpace: false, // check for extra space inside parens when defining or using mixins
		placeholders: true, // only allow @extending of placeholder vars
		quotePref: false, // single or double quotes, or false to not check
		semicolons: false, // check for unecessary semicolons
		sortOrder: false, // alphabetical, grouped, Array<String> or false (no check)
		stackedProperties: false, // no one liners
		trailingWhitespace: true, // check for trailing whitespace
		universal: true, // check for use of * and recommend against it
		valid: false, // check if prop or value is a valid assignment
		varStyle: false, // check for $ when declaring vars (doesnt check use)
		zeroUnits: true, // check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
		zIndexDuplicates: false, // just find duplicate z index values
		zIndexNormalize: false // suggest a normalized z index value, base of whatever this is
	}
});
