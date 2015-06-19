var stampit = require('stampit');

/**`
 * @description 'core' methods, the basic read -> parse -> test -> done cycle
 * @return {Object} [i expose the modules to the entire app, so we only do it once]
 */
module.exports = stampit().methods({
	cache: require('./cache'),
	state: require('./state'),
	flags: require('./flags'),
	config: require('./config'),
	init: require('./init'),
	done: require('./done'),
	help: require('./help'),
	read: require('./read'),
	parse: require('./parse'),
	setState: require('./setState'),
	lint: require('./lint'),
	ver: require('./ver'),
	watch: require('./watch'),
	watcher: undefined
});
