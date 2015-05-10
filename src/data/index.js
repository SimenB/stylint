var stampit = require('stampit');

/**`
 * @description 'core' methods, the basic read -> parse -> test -> done cycle
 * @return {Object} [i expose the modules to the entire app, so we only do it once]
 */
module.exports = stampit().state({
	cache: require('./cache'),
	state: require('./state'),
	flags: require('./flags'),
	config: require('./config')
});
