/**
 * default configuration object
 * this is what the linter will run when no config file is passed
 */
module.exports = {
	// check for @block when defining blocks
	blocks: {
		expect: 'never',
		error: true,
	},
	// check for { or }, unless used in a hash
	brackets: false,
	// check for unecessary colons @TODO make jscs
	colons: false,
	// check for hex colors used without variables
	colors: false,
	// check for spaces after commas (0, 0, 0, .18)
	commaSpace: false,
	// check for space after line comment
	commentSpace: false,
	// if true disallow css literals
	cssLiteral: false,
	// set a maximum selector depth (dont nest more than 4 deep)
	depthLimit: false,
	// check if properties or selectors are duplicate
	duplicates: true,
	// check for margin 0 0 0 0 and recommend margin 0 // @TODO make jscs
	efficient: true,
	// prefer a specific syntax when using @extends (or @extend)
	extendPref: '@extends',
	// throw duplicate selector warning across all files instead of curr file
	globalDupe: false,
	// how many spaces should we prefer when indenting, pass in false if hard tabs
	indentPref: 4,
	// find cases where 0.# is used, prefer .#
	leadingZero: false,
	// exit if over error limit
	maxErrors: false,
	// exit if over warning limit
	maxWarnings: false,
	// check for mixed spaces and tabs
	mixed: false,
	// lowercase-dash, camelCase, lowercase_underscore, BEM or false (dont check)
	namingConvention: false,
	// if true, then check classes and ids, if false just check variables
	namingConventionStrict: false,
	// check for use of border none or outline none, prefer 0
	none: 'never',
	// check for extra space inside parens
	parenSpace: false,
	// only allow @extending of placeholder vars
	placeholders: 'always',
	// check for $ when declaring vars (doesnt check use)
	prefixVarsWithDollar: false,
	// single or double quotes, or false to not check
	quotePref: false,
	// default reporter
	reporter: '../core/reporter',
	// check for unecessary semicolons @TODO make jscs
	semicolons: false,
	// alphabetical, grouped, Array<String> or false (no check)
	sortOrder: false,
	// no one liners
	stackedProperties: true,
	// check for trailing whitespace
	trailingWhitespace: true,
	// check for use of * and recommend against it
	universal: true,
	// check if prop or value is a valid assignment
	valid: false,
	// check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
	zeroUnits: false,
	// suggest a normalized z index value, base of whatever this is
	zIndexNormalize: false
};
