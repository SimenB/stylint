var stampit = require('stampit');

/**
 * @description i hold the state
 * @return {Object} [i expose properties to the entire app]
 */
module.exports = stampit().state({
	state: {
		cssBlock: false,
		dir: undefined,
		exitCode: 1,
		hash: false,
		strictMode: false,
		testsEnabled: true, // are we running linter tests
		toggleBlock: false, // @stylint off
		quiet: false,
		watching: false
	}
});
