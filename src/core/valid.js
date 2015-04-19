var stampit = require('stampit');

/**
 * @description i hold the whitelist for what is a valid property or not
 * @return {Object} [i expose properties to the entire app]
 */
module.exports = stampit().state({
	valid: require('../data/getValid')()
});
