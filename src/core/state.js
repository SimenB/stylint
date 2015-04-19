var stampit = require('stampit');

/**
 * @description i hold the state
 * @return {Object} [i expose properties to the entire app]
 */
module.exports = stampit().state({
	state: {
		cssBlock: false, // are we in a css literal
		exitCode: 1, // err or no err
		hash: false, // are we in a hash
		killSwitch: false, // are we over our warning limit
		path: undefined, // curr dir || file
		strictMode: false, // run all tests regardless?
		testsEnabled: true, // are we running linter tests
		toggleBlock: false, // @stylint off
		quiet: false, // turn off console logs
		watching: false // are we watching
	}
});
