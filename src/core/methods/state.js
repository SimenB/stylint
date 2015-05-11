var stampit = require('stampit');

// very simple, 1 purpose methods, that run regex/indexOf checks on strings
module.exports = stampit().methods({
	stateMethods: {
		hashOrCSSEnd: require('../../checks/hashOrCSSEnd'),
		hashOrCSSStart: require('../../checks/hashOrCSSStart'),
		keyframesEnd: require('../../checks/keyframesEnd'),
		keyframesStart: require('../../checks/keyframesStart'),
		startsWithComment: require('../../checks/startsWithComment'),
		stylintOff: require('../../checks/stylintOff'),
		stylintOn: require('../../checks/stylintOn')
	}
});
