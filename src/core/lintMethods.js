var stampit = require('stampit');

// very simple, 1 purpose methods, that run regex/indexOf checks on strings
module.exports = stampit().methods({
	lintMethods: {
		blockStyle: require('../checks/blockStyle'),
		brackets: require('../checks/brackets'),
		colons: require('../checks/colons'),
		colors: require('../checks/colors'),
		commaSpace: require('../checks/commaSpace'),
		commentSpace: require('../checks/commentSpace'),
		cssLiteral: require('../checks/cssLiteral'),
		depthLimit: require('../checks/depthLimit'),
		duplicates: require('../checks/duplicates'),
		efficient: require('../checks/efficient'),
		extendPref: require('../checks/extendPref'),
		leadingZero: require('../checks/leadingZero'),
		mixed: require('../checks/mixed'),
		namingConvention: require('../checks/namingConvention'),
		noNone: require('../checks/noNone'),
		parenSpace: require('../checks/parenSpace'),
		placeholders: require('../checks/placeholders'),
		quotePref: require('../checks/quotePref'),
		semicolons: require('../checks/semicolons'),
		sortOrder: require('../checks/sortOrder'),
		stackedProperties: require('../checks/stackedProperties'),
		trailingWhitespace: require('../checks/trailingWhitespace'),
		universal: require('../checks/universal'),
		valid: require('../checks/valid'),
		varStyle: require('../checks/varStyle'),
		zeroUnits: require('../checks/zeroUnits'),
		zIndexDuplicates: require('../checks/zIndexDuplicates'),
		zIndexNormalize: require('../checks/zIndexNormalize')
	}
});
