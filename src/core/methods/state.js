var stampit = require('stampit');

// very simple, 1 purpose methods, that run regex/indexOf checks on strings
module.exports = stampit().methods({
	stateMethods: {
		commentExists: require('../../checks/commentExists'),
		hashEnd: require('../../checks/hashEnd'),
		hashStart: require('../../checks/hashStart'),
		keyframesEnd: require('../../checks/keyframesEnd'),
		keyframesStart: require('../../checks/keyframesStart'),
		startsWithComment: require('../../checks/startsWithComment'),
		stylintOff: require('../../checks/stylintOff'),
		stylintOn: require('../../checks/stylintOn')
	}
});
