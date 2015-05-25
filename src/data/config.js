/**
 * configuration related properties
 * this is what the linter will run when no config file is passed
 */
module.exports = {
	blocks: false, // check for @block when defining blocks
	brackets: false, // check for { or }, unless used in a hash
	colons: false, // check for unecessary colons @TODO make jscs
	colors: false, // check for hex colors used without variables
	commaSpace: false, // check for spaces after commas (0, 0, 0, .18)
	commentSpace: false, // check for space after line comment
	cssLiteral: false, // if true disallow css literals
	depthLimit: false, // set a maximum selector depth (dont nest more than 4 deep)
	duplicates: true, // check if properties or selectors are duplicate
	efficient: true, // check for margin 0 0 0 0 and recommend margin 0
	emoji: false, // toggle emoji on or off @TODO make it just a reporter options
	extendPref: false, // prefer a specific syntax when using @extends (or @extend)
	globalDupe: false, // throw duplicate selector warning across all files instead of curr file
	indentPref: 4, // how many spaces should we prefer when indenting, pass in false if hard tabs
	leadingZero: false, // find cases where 0.# is used, prefer .#
	maxWarnings: 10, // should we have a max amount of warnings, and error out if we go over
	maxWarningsKill: false, // if over maxWarning count, kill process
	mixed: false, // check for mixed spaces and tabs
	namingConvention: false, // lowercase-dash, camelCase, lowercase_underscore, BEM or false (dont check)
	namingConventionStrict: false, // if true, then check classes and ids, if false just check variables
	none: 'never', // check for use of border none or outline none, prefer 0
	parenSpace: false, // check for extra space inside parens when defining or using mixins @TODO make jscs
	placeholders: true, // only allow @extending of placeholder vars @TODO make jscs
	quotePref: false, // single or double quotes, or false to not check
	semicolons: false, // check for unecessary semicolons @TODO make jscs
	sortOrder: false, // alphabetical, grouped, Array<String> or false (no check)
	stackedProperties: false, // no one liners
	trailingWhitespace: true, // check for trailing whitespace
	universal: true, // check for use of * and recommend against it
	valid: false, // check if prop or value is a valid assignment
	varStyle: false, // check for $ when declaring vars (doesnt check use) @todo make jscs
	zeroUnits: true, // check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead @todo make jscs
	zIndexNormalize: false // suggest a normalized z index value, base of whatever this is
};
