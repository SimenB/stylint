var stampit = require('stampit');

/**`
 * @description 'core' methods, the basic read -> parse -> test -> done cycle
 * @return {Object} [i expose the modules to the entire app, so we only do it once]
 */
module.exports = stampit().methods({
	done: require('./done'),
	help: require('./help'),
	read: require('./read'),
	parse: require('./parse'),
	lint: require('./lint'),
	ver: require('./version'),
	watch: require('./watch')
});
