var stampit = require('stampit');

// very simple, 1 purpose methods, that run regex/indexOf checks on strings
module.exports = stampit().methods({
	test: {
		block: require('../checks/block'),
		borderNone: require('../checks/borderNone'),
		brackets: require('../checks/brackets'),
		colon: require('../checks/colon'),
		colors: require('../checks/colors'),
		comma: require('../checks/comma'),
		commentSpace: require('../checks/commentSpace'),
		commentExists: require('../checks/commentExists'),
		cssLiteral: require('../checks/cssLiteral'),
		duplicates: require('../checks/duplicates'),
		efficient: require('../checks/efficient'),
		extends: require('../checks/extends'),
		hashEnd: require('../checks/hashEnd'),
		hashStart: require('../checks/hashStart'),
		leadingZero: require('../checks/leadingZero'),
		mixed: require('../checks/mixed'),
		namingConvention: require('../checks/namingConvention'),
		nesting: require('../checks/nesting'),
		paren: require('../checks/paren'),
		placeholder: require('../checks/placeholder'),
		quotes: require('../checks/quotes'),
		semicolon: require('../checks/semicolon'),
		sortOrder: require('../checks/sortOrder'),
		startsWithComment: require('../checks/startsWithComment'),
		universal: require('../checks/universal'),
		valid: require('../checks/valid'),
		varStyle: require('../checks/var'),
		whitespace: require('../checks/trailingWhitespace'),
		zeroUnits: require('../checks/zeroUnits'),
		zIndexDupe: require('../checks/zIndexDupe'),
		zIndexNormalize: require('../checks/zIndexNormalize')
	}
});
