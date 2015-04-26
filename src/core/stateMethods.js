var stampit = require('stampit');

// very simple, 1 purpose methods, that run regex/indexOf checks on strings
module.exports = stampit().methods({
	stateMethods: {
		commentExists: require('../checks/commentExists'),
		hashEnd: require('../checks/hashEnd'),
		hashStart: require('../checks/hashStart'),
		keyframeEnd: require('../checks/keyframeEnd'),
		keyframeStart: require('../checks/keyframeStart'),
		startsWithComment: require('../checks/startsWithComment'),
		stylintOff: require('../checks/stylintOff'),
		stylintOn: require('../checks/stylintOn')
	}
});
