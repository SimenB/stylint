var stampit = require('stampit');

// flags for the cli
module.exports = stampit().state({
	flags: [
		'-c',
		'-w',
		'-s',
		'-v',
		'-h',
		'--config',
		'--watch',
		'--strict',
		'--version',
		'--help',
		'--harmony'
	]
});
